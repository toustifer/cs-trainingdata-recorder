#!/usr/bin/env node

/**
 * 独立启动 WebSocket 服务器用于调试
 * 监听端口 4574，等待 CS2 插件连接
 */

import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const serverPath = path.join(__dirname, '..', 'src', 'server', 'server.js');

console.log('='.repeat(80));
console.log('启动 WebSocket 服务器 (端口 4574)');
console.log('='.repeat(80));
console.log(`服务器路径: ${serverPath}`);
console.log('');

const serverProcess = spawn('node', [serverPath], {
  stdio: 'inherit',  // 将所有输出显示到控制台
  detached: false
});

serverProcess.on('exit', (code) => {
  console.log(`\n服务器退出，退出码: ${code}`);
  process.exit(code || 0);
});

serverProcess.on('error', (error) => {
  console.error(`\n服务器错误:`, error);
  process.exit(1);
});

// 处理 Ctrl+C
process.on('SIGINT', () => {
  console.log('\n\n收到中断信号，关闭服务器...');
  serverProcess.kill();
  process.exit(0);
});

console.log('WebSocket 服务器正在运行...');
console.log('按 Ctrl+C 停止');
console.log('');
