import { killCounterStrikeProcesses } from 'csdm/node/counter-strike/kill-counter-strike-processes';
import { killHlaeProcess } from 'csdm/node/video/hlae/kill-hlae-process';
import { sleep } from 'csdm/common/sleep';

type RetryOptions = {
  maxRetries?: number; // 最大重试次数，默认3次
  timeoutMs?: number; // 超时时间（毫秒），默认5分钟
  onRetry?: (attempt: number, error: Error) => void; // 重试回调
  taskName?: string; // 任务名称（用于日志）
};

/**
 * 为异步任务添加超时和重试机制
 * 如果任务超时或失败，会自动kill CS进程并重试
 */
export async function withRetryOnTimeout<T>(
  task: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const {
    maxRetries = 3,
    timeoutMs = 5 * 60 * 1000, // 默认5分钟
    onRetry,
    taskName = 'Task',
  } = options;

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.log(`${taskName} - Attempt ${attempt}/${maxRetries}`);

      // 创建超时Promise
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => {
          reject(new Error(`${taskName} timeout after ${timeoutMs}ms`));
        }, timeoutMs);
      });

      // 竞速：任务完成 vs 超时
      const result = await Promise.race([task(), timeoutPromise]);

      logger.log(`${taskName} - Attempt ${attempt} succeeded`);
      return result;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));
      logger.error(`${taskName} - Attempt ${attempt} failed: ${lastError.message}`);

      if (attempt < maxRetries) {
        logger.log(`${taskName} - Killing processes and retrying...`);

        // Kill所有可能卡住的进程
        try {
          await Promise.all([killCounterStrikeProcesses(), killHlaeProcess()]);
        } catch (killError) {
          logger.warn(`Failed to kill processes: ${killError}`);
        }

        // 等待2秒让进程完全退出
        await sleep(2000);

        // 调用重试回调
        if (onRetry) {
          try {
            onRetry(attempt, lastError);
          } catch (callbackError) {
            logger.warn(`Retry callback failed: ${callbackError}`);
          }
        }
      }
    }
  }

  // 所有重试都失败
  throw new Error(
    `${taskName} failed after ${maxRetries} attempts. Last error: ${lastError?.message}`,
  );
}
