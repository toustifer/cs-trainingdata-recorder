#!/usr/bin/env node

/**
 * 手动安装 CS2 服务器插件
 */

import { installCs2ServerPlugin } from '../src/node/counter-strike/launcher/cs2-server-plugin.js';

console.log('开始安装 CS2 服务器插件...');

try {
  await installCs2ServerPlugin();
  console.log('✓ CS2 服务器插件安装成功');
} catch (error) {
  console.error('✗ 安装失败:', error.message);
  console.error(error);
  process.exit(1);
}
