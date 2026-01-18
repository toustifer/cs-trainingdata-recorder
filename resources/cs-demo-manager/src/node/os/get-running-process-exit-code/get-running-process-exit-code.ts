import { exec } from 'node:child_process';
import { promisify } from 'node:util';
import { isWindows } from 'csdm/node/os/is-windows';
import { sleep } from 'csdm/common/sleep';

const execAsync = promisify(exec);

// eslint-disable-next-line @typescript-eslint/no-require-imports
let nativeModule: { getRunningProcessExitCode: (processName: string) => Promise<number> } | null = null;
try {
  const module = require('./build/Release/get_running_process_exit_code.node');
  if (module && typeof module.getRunningProcessExitCode === 'function') {
    nativeModule = module;
  }
} catch {
  // Native module not available (e.g., CLI-only build)
}

async function getRunningProcessExitCodeFallback(processName: string): Promise<number> {
  logger.debug(`Waiting for process ${processName} to exit (using fallback method)`);

  if (isWindows) {
    // Windows: 使用 tasklist 轮询检查进程是否存在
    while (true) {
      try {
        const { stdout } = await execAsync(`tasklist /FI "IMAGENAME eq ${processName}" /NH`);
        if (!stdout.includes(processName)) {
          // 进程已退出
          logger.debug(`Process ${processName} exited`);
          return 0; // 假设正常退出
        }
      } catch (error) {
        logger.debug(`Process ${processName} exited with error`);
        return 1;
      }
      await sleep(1000); // 每秒检查一次
    }
  } else {
    // Unix: 使用 pgrep 轮询
    while (true) {
      try {
        await execAsync(`pgrep -x ${processName}`);
        // 进程仍在运行
        await sleep(1000);
      } catch {
        // 进程已退出
        logger.debug(`Process ${processName} exited`);
        return 0;
      }
    }
  }
}

export async function getRunningProcessExitCode(processName: string): Promise<number> {
  if (nativeModule) {
    logger.debug(`Waiting for process ${processName} to exit (using native module)`);
    const exitCode = await nativeModule.getRunningProcessExitCode(processName);
    logger.debug(`Process ${processName} exited with code ${exitCode}`);
    return exitCode;
  }

  // 使用回退方法
  return getRunningProcessExitCodeFallback(processName);
}
