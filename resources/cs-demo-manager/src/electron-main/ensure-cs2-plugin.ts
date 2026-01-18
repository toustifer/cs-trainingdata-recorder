import path from 'node:path';
import fs from 'fs-extra';
import { getCsgoFolderPathOrThrow } from 'csdm/node/counter-strike/get-csgo-folder-path';
import { Game } from 'csdm/common/types/counter-strike';
import { getStaticFolderPath } from 'csdm/node/filesystem/get-static-folder-path';
import { isWindows } from 'csdm/node/os/is-windows';
import { getSettings } from 'csdm/node/settings/get-settings';
import { CS2PluginVersion } from 'csdm/common/types/cs2-plugin-version';

/**
 * 确保 CS2 插件已安装并且 gameinfo.gi 配置正确
 * 在每次录制前调用，确保录制功能正常工作
 */
export async function ensureCs2PluginInstalled(): Promise<void> {
  try {
    logger.log('Checking CS2 plugin installation...');

    // 获取 CS2 路径
    const csgoFolderPath = await getCsgoFolderPathOrThrow(Game.CS2);
    const pluginFolder = path.join(csgoFolderPath, 'game', 'csgo', 'csdm');
    const binFolderPath = isWindows
      ? path.join(pluginFolder, 'bin')
      : path.join(pluginFolder, 'bin', 'linuxsteamrt64');
    const gameInfoFilePath = path.join(csgoFolderPath, 'game', 'csgo', 'gameinfo.gi');

    // 1. 安装插件文件
    await fs.mkdirp(binFolderPath);

    const settings = await getSettings();
    const version = settings.playback.cs2PluginVersion ?? CS2PluginVersion.latest;
    const bundledBinaryName =
      version !== CS2PluginVersion.latest
        ? isWindows
          ? `server_${version}.dll`
          : `libserver_${version}.so`
        : isWindows
          ? 'server.dll'
          : 'libserver.so';

    const sourcePath = path.join(getStaticFolderPath(), 'cs2', bundledBinaryName);
    const targetPath = path.join(binFolderPath, isWindows ? 'server.dll' : 'libserver.so');

    const sourceExists = await fs.pathExists(sourcePath);
    if (!sourceExists) {
      logger.error(`Plugin source file not found: ${sourcePath}`);
      return;
    }

    // 检查是否需要更新插件
    const targetExists = await fs.pathExists(targetPath);
    if (!targetExists) {
      logger.log('Installing CS2 plugin...');
      await fs.copyFile(sourcePath, targetPath);
      logger.log(`✓ Plugin installed: ${targetPath}`);
    } else {
      // 比较文件大小，如果不同则更新
      const sourceStats = await fs.stat(sourcePath);
      const targetStats = await fs.stat(targetPath);

      if (sourceStats.size !== targetStats.size) {
        logger.log('Updating CS2 plugin...');
        await fs.copyFile(sourcePath, targetPath);
        logger.log('✓ Plugin updated');
      } else {
        logger.log('✓ Plugin already installed');
      }
    }

    // 2. 修复 gameinfo.gi 配置
    const gameInfoExists = await fs.pathExists(gameInfoFilePath);
    if (!gameInfoExists) {
      logger.warn(`gameinfo.gi not found: ${gameInfoFilePath}`);
      return;
    }

    const content = await fs.readFile(gameInfoFilePath, 'utf8');

    // 检查是否包含 csgo/csdm 配置
    if (!content.includes('Game\tcsgo/csdm')) {
      logger.log('Adding csgo/csdm to gameinfo.gi...');

      // 备份原文件
      const backupPath = `${gameInfoFilePath}.backup`;
      const backupExists = await fs.pathExists(backupPath);
      if (!backupExists) {
        await fs.copyFile(gameInfoFilePath, backupPath);
        logger.log(`✓ Backup created: ${backupPath}`);
      }

      // 在第一个 "Game csgo" 之前插入 "Game csgo/csdm"
      const newContent = content.replace(/(\s+Game\s+csgo)(?!\/)/, '\t\t\tGame\tcsgo/csdm\n$1');
      await fs.writeFile(gameInfoFilePath, newContent);
      logger.log('✓ Added csgo/csdm to gameinfo.gi');
    } else {
      // 检查顺序是否正确（csgo/csdm 必须在 csgo 之前）
      const lines = content.split('\n');
      let csdmIndex = -1;
      let csgoIndex = -1;

      for (let i = 0; i < lines.length; i++) {
        if (/Game\s+csgo\/csdm/.test(lines[i])) {
          csdmIndex = i;
        }
        if (/Game\s+csgo$/.test(lines[i])) {
          csgoIndex = i;
        }
      }

      if (csgoIndex !== -1 && csdmIndex !== -1 && csdmIndex > csgoIndex) {
        logger.warn('csgo/csdm is after csgo in gameinfo.gi, fixing order...');

        // 备份原文件
        const backupPath = `${gameInfoFilePath}.backup`;
        const backupExists = await fs.pathExists(backupPath);
        if (!backupExists) {
          await fs.copyFile(gameInfoFilePath, backupPath);
        }

        // 修正顺序：将 csgo/csdm 移到 csgo 之前
        const newContent = content.replace(/(\s+Game\s+csgo)\r?\n(\s+Game\s+csgo\/csdm)/, '$2\n$1');
        await fs.writeFile(gameInfoFilePath, newContent);
        logger.log('✓ Fixed csgo/csdm order in gameinfo.gi');
      } else {
        logger.log('✓ gameinfo.gi configuration is correct');
      }
    }

    logger.log('CS2 plugin check completed successfully');
  } catch (error) {
    logger.error('Failed to ensure CS2 plugin installation');
    logger.error(error);
    // 不抛出错误，避免阻塞录制流程
  }
}
