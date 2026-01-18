#!/usr/bin/env node

/**
 * 完整的训练数据收集流水线
 *
 * 功能：
 * 1. 导出训练数据元数据（situation + events）到数据库
 * 2. 启动 CS2 并录制视频帧
 * 3. 整合成完整的训练数据
 *
 * 输出格式：
 * - 400ms 时间窗口
 * - 起始帧图片路径
 * - situation（起始帧之前的情况）
 * - 中间 8 帧图片路径
 * - 结束帧图片路径
 * - 起始帧到结束帧之间发生的事件
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 解析命令行参数
const demoPath = process.argv[2];
const playerSteamId = process.argv[3];
const roundNumber = process.argv[4] ? parseInt(process.argv[4]) : undefined;

if (!demoPath || !playerSteamId || !roundNumber) {
  console.error('用法: node complete-training-pipeline.mjs <demo路径> <玩家Steam ID> <回合号>');
  console.error('');
  console.error('示例:');
  console.error('  node complete-training-pipeline.mjs "D:/demos/match.dem" 76561198000000001 1');
  process.exit(1);
}

console.log('='.repeat(80));
console.log('CS2 训练数据完整收集流水线');
console.log('='.repeat(80));
console.log('');
console.log(`Demo: ${demoPath}`);
console.log(`玩家: ${playerSteamId}`);
console.log(`回合: ${roundNumber ? `第 ${roundNumber} 回合` : '所有回合'}`);
console.log('录制配置:');


// 执行命令的辅助函数
function runCommand(command, args, description) {
  return new Promise((resolve, reject) => {
    console.log(`\n${'='.repeat(80)}`);
    console.log(`步骤: ${description}`);
    console.log(`${'='.repeat(80)}`);
    console.log(`执行: ${command} ${args.join(' ')}`);
    console.log('');

    const proc = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      cwd: __dirname
    });

    proc.on('exit', (code) => {
      if (code === 0) {
        console.log(`\n✓ ${description} 完成`);
        resolve();
      } else {
        console.error(`\n✗ ${description} 失败 (退出码: ${code})`);
        reject(new Error(`${description} failed with code ${code}`));
      }
    });

    proc.on('error', (error) => {
      console.error(`\n✗ ${description} 错误:`, error.message);
      reject(error);
    });
  });
}

async function main() {
  try {
    // 步骤 1: 导出训练数据元数据到数据库
    const exportArgs = [
      path.join(__dirname, '..', 'out', 'cli.js'),
      'training-data',
      demoPath,
      '--players', playerSteamId
    ];

    if (roundNumber) {
      exportArgs.push('--rounds', String(roundNumber));
    }

    await runCommand('node', exportArgs, '导出训练数据元数据');

    // 步骤 2: 查询导出的数据获取 checksum
    console.log('\n查询已导出的数据...');
    const { execSync } = await import('child_process');
    const queryOutput = execSync(
      `node "${path.join(__dirname, '..', 'out', 'cli.js')}" query-training --limit 1`,
      { encoding: 'utf-8' }
    );

    const checksumMatch = queryOutput.match(/Demo Checksum: ([a-f0-9]+)/);
    if (!checksumMatch) {
      throw new Error('无法从数据库获取 checksum');
    }

    const checksum = checksumMatch[1];
    console.log(`✓ 获取到 checksum: ${checksum}`);

    // 步骤 3: 录制视频帧（使用简化的 CLI 工具）
    const recordArgs = [
      path.join(__dirname, 'cli-generate-frames.mjs'),
      '--checksum', checksum,
      '--player', playerSteamId,
      '--round', String(roundNumber),
      '--demo', demoPath
    ];

    await runCommand('node', recordArgs, '录制视频帧');

    // 步骤 4: 验证训练数据完整性
    console.log('\n' + '='.repeat(80));
    console.log('验证训练数据完整性');
    console.log('='.repeat(80));
    console.log('');

    const verifyOutput = execSync(
      `node "${path.join(__dirname, '..', 'out', 'cli.js')}" query-training --limit 3`,
      { encoding: 'utf-8' }
    );

    console.log(verifyOutput);

    // 步骤 5: 检查图片文件
    console.log('\n检查图片文件...');
    const firstWindowQuery = execSync(
      `node "${path.join(__dirname, '..', 'out', 'cli.js')}" query-training --limit 1`,
      { encoding: 'utf-8' }
    );

    const framePathMatch = firstWindowQuery.match(/起始帧: (.+\.jpg)/);
    if (framePathMatch) {
      const framePath = framePathMatch[1].trim();
      const fs = await import('fs');

      if (fs.existsSync(framePath)) {
        console.log(`✓ 图片文件存在: ${framePath}`);

        // 统计总帧数
        const frameDir = path.dirname(framePath);
        const files = fs.readdirSync(frameDir);
        const jpgFiles = files.filter(f => f.endsWith('.jpg'));
        console.log(`✓ 总共生成 ${jpgFiles.length} 个图片文件`);
      } else {
        console.warn(`⚠ 图片文件不存在: ${framePath}`);
      }
    }

    // 成功完成
    console.log('\n' + '='.repeat(80));
    console.log('✓ 训练数据收集完成！');
    console.log('='.repeat(80));
    console.log('');
    console.log('数据格式：');
    console.log('  - 时间窗口: 400ms (10帧 @ 25fps)');
    console.log('  - 起始帧: frame_0001.jpg, frame_0011.jpg, ...');
    console.log('  - 中间帧: 8 帧');
    console.log('  - 结束帧: frame_0010.jpg, frame_0020.jpg, ...');
    console.log('  - Situation: 起始帧之前的玩家状态');
    console.log('  - Events: 窗口内发生的事件');
    console.log('');
    console.log('使用以下命令查看详细数据：');
    console.log(`  node out/cli.js query-training`);
    console.log('');

  } catch (error) {
    console.error('\n' + '='.repeat(80));
    console.error('✗ 流水线失败');
    console.error('='.repeat(80));
    console.error('');
    console.error('错误:', error.message);
    console.error('');
    process.exit(1);
  }
}

main();
