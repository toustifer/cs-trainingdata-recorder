import fs from 'fs-extra';
import path from 'node:path';
import os from 'node:os';
import { glob } from 'csdm/node/filesystem/glob';
import { type DemoSource, SupportedDemoSources } from 'csdm/common/types/counter-strike';
import { Command } from './command';
import { runDemoAnalyzer } from 'csdm/node/demo-analyzer/run-demo-analyzer';
import { fetchMatchChecksums } from 'csdm/node/database/matches/fetch-match-checksums';
import { getDemoChecksumFromDemoPath } from 'csdm/node/demo/get-demo-checksum-from-demo-path';
import { processMatchInsertion } from 'csdm/node/database/matches/process-match-insertion';
import { migrateSettings } from 'csdm/node/settings/migrate-settings';
import { exportAllPlayersTrainingData } from 'csdm/node/training-data/export-training-data';
import { getDemoFromFilePath } from 'csdm/node/demo/get-demo-from-file-path';
import { fetchMatchPlayers } from 'csdm/node/database/match-players/fetch-match-players';
import { fetchRounds } from 'csdm/node/database/rounds/fetch-rounds';
import { db } from 'csdm/node/database/database';

export class TrainingDataCommand extends Command {
  public static Name = 'training-data';
  private readonly demoPaths: string[] = [];
  private forceAnalyze = false;
  private analyzePositions = true; // 默认开启位置分析
  private source: DemoSource | undefined = undefined;
  private temporaryFolderPath = path.resolve(os.tmpdir(), 'cs-demo-manager-cli');
  private outputFolderPath: string | undefined;
  private playerSteamIds: string[] = [];
  private windowMs = 400; // 默认400ms窗口
  private framesPerWindow = 10; // 每窗口10帧（25fps）
  private framesDir: string | undefined; // 视频帧目录
  private listPlayersOnly = false; // 只列出玩家
  private roundNumbers: number[] = []; // 指定回合

  private readonly sourceFlag = '--source';
  private readonly forceFlag = '--force';
  private readonly outputFlag = '--output';
  private readonly playersFlag = '--players';
  private readonly windowFlag = '--window';
  private readonly framesFlag = '--frames';
  private readonly framesDirFlag = '--frames-dir';
  private readonly listPlayersFlag = '--list-players';
  private readonly roundsFlag = '--rounds';

  public getDescription() {
    return 'Export training data (player states + events) for all players in a demo.';
  }

  public printHelp() {
    const sourceValues = SupportedDemoSources.join(',');
    console.log(this.getDescription());
    console.log('');
    console.log(`Usage: csdm ${TrainingDataCommand.Name} demoPaths... [options]`);
    console.log('');
    console.log('Exports per-player training data with:');
    console.log('  - Player state snapshots (position, health, weapon, etc.)');
    console.log('  - Movement direction inference (WASD)');
    console.log('  - Events (kills, damage, shots, etc.)');
    console.log('  - 400ms time windows with 10 frames (25fps) by default');
    console.log('');
    console.log('Output JSON structure per window:');
    console.log('  - startFramePath: first frame of the window');
    console.log('  - middleFramePaths: frames 2-9');
    console.log('  - endFramePath: last frame of the window');
    console.log('  - situation: player state before the window');
    console.log('  - events: events that occurred during the window');
    console.log('');
    console.log('Options:');
    console.log(`  ${this.listPlayersFlag}          List players in demo (no export)`);
    console.log(`  ${this.roundsFlag} <numbers>     Comma-separated round numbers to export (default: all)`);
    console.log(`  ${this.outputFlag} <path>       Output folder path (default: demo folder/training_data)`);
    console.log(`  ${this.framesDirFlag} <path>  Directory containing video frames (default: output/frames)`);
    console.log(`  ${this.playersFlag} <ids>       Comma-separated Steam IDs to export (default: all)`);
    console.log(`  ${this.windowFlag} <ms>         Time window in milliseconds (default: 400)`);
    console.log(`  ${this.framesFlag} <n>          Frames per window (default: 10, i.e., 25fps)`);
    console.log(`  ${this.sourceFlag} <source>     Demo source: [${sourceValues}]`);
    console.log(`  ${this.forceFlag}               Force re-analyze even if in database`);
    console.log('');
    console.log('Examples:');
    console.log('');
    console.log('Export all players from a demo:');
    console.log(`    csdm ${TrainingDataCommand.Name} "C:\\demos\\match.dem"`);
    console.log('');
    console.log('Export specific player with custom frames directory:');
    console.log(`    csdm ${TrainingDataCommand.Name} "C:\\demos\\match.dem" ${this.playersFlag} 76561198000000001 ${this.framesDirFlag} "C:\\frames"`);
    console.log('');
    console.log('Export with 200ms windows and 5 frames per window (25fps):');
    console.log(`    csdm ${TrainingDataCommand.Name} "C:\\demos\\match.dem" ${this.windowFlag} 200 ${this.framesFlag} 5`);
    console.log('');
    console.log('List all players in a demo (quick, no export):');
    console.log(`    csdm ${TrainingDataCommand.Name} "C:\\demos\\match.dem" ${this.listPlayersFlag}`);
    console.log('');
    console.log('Export only round 1 for a specific player:');
    console.log(`    csdm ${TrainingDataCommand.Name} "C:\\demos\\match.dem" ${this.playersFlag} 76561198000000001 ${this.roundsFlag} 1`);
  }

  public async run() {
    await this.parseArgs();

    if (this.demoPaths.length === 0) {
      console.log('No demos found');
      this.exitWithFailure();
    }

    await migrateSettings();
    await this.initDatabaseConnection();
    const checksumsInDatabase = await fetchMatchChecksums();

    if (!this.listPlayersOnly) {
      console.log(`${this.demoPaths.length} demo(s) to process`);
      console.log(`Time window: ${this.windowMs}ms, ${this.framesPerWindow} frames per window (${(this.framesPerWindow * 1000 / this.windowMs).toFixed(0)}fps)`);
      if (this.roundNumbers.length > 0) {
        console.log(`Rounds: ${this.roundNumbers.join(', ')}`);
      }
      console.log('');
    }

    for (const demoPath of this.demoPaths) {
      try {
        console.log(`\n[DEBUG] ====== Processing demo: ${demoPath} ======`);

        console.log('[DEBUG] Step 1: Calculating checksum...');
        const checksum = await getDemoChecksumFromDemoPath(demoPath);
        console.log(`[DEBUG] Checksum: ${checksum}`);

        const isDemoAlreadyInDatabase = checksumsInDatabase.includes(checksum);
        console.log(`[DEBUG] Is demo in database? ${isDemoAlreadyInDatabase}`);
        console.log(`[DEBUG] Force analyze? ${this.forceAnalyze}`);

        if (!isDemoAlreadyInDatabase || this.forceAnalyze) {
          console.log('[DEBUG] Step 2: Analyzing demo...');
          await this.analyzeDemo(demoPath);

          console.log('[DEBUG] Step 3: Inserting into database (psql CLI)...');
          try {
            await this.insertMatchInDatabase(checksum, demoPath);
            console.log('[DEBUG] Step 3 completed successfully');
          } catch (insertError) {
            console.warn('[DEBUG] ⚠️ Step 3 failed (CSV file issue), but continuing...');
            console.warn(`[DEBUG] Insert error: ${insertError instanceof Error ? insertError.message : insertError}`);
            console.warn('[DEBUG] Will use fallback mechanism (read demo file directly)');
          }

          // 关键修复：等待 psql CLI 进程完成并提交事务
          console.log('[DEBUG] Step 4: Waiting for database commit (3s delay)...');
          await new Promise(resolve => setTimeout(resolve, 3000));
          console.log('[DEBUG] Database commit wait completed');
        } else {
          console.log('[DEBUG] Using cached data from database');
        }

        // --list-players 模式：只列出玩家和回合信息
        if (this.listPlayersOnly) {
          console.log('[DEBUG] List players mode - fetching players and rounds...');
          const players = await fetchMatchPlayers(checksum);
          const rounds = await fetchRounds(checksum);

          console.log('');
          console.log(`Players (${players.length}):`);
          console.log('─'.repeat(60));
          for (const player of players) {
            const teamLabel = player.teamName || 'Unknown';
            console.log(`  ${player.name}`);
            console.log(`    Steam ID: ${player.steamId}`);
            console.log(`    Team: ${teamLabel} | K/D/A: ${player.killCount}/${player.deathCount}/${player.assistCount}`);
          }
          console.log('');
          console.log(`Rounds: ${rounds.length}`);
          console.log('');
          continue;
        }

        console.log('[DEBUG] Step 5: Fetching tickrate from database (with retry)...');

        // 获取 tickrate（从 matches 表查询，因为 demos 表可能为空）
        // 使用重试机制，因为 psql CLI 可能还在提交事务
        let matchResult = null;
        for (let attempt = 0; attempt < 5; attempt++) {
          console.log(`[DEBUG] Query attempt ${attempt + 1}/5...`);
          matchResult = await db
            .selectFrom('matches')
            .select(['tickrate', 'name'])
            .where('checksum', '=', checksum)
            .executeTakeFirst();

          if (matchResult) {
            console.log(`[DEBUG] ✓ Match found! tickrate=${matchResult.tickrate}, name=${matchResult.name}`);
            break;
          }

          if (attempt < 4) {
            console.log(`[DEBUG] ✗ Match not found, waiting 2s before retry...`);
            await new Promise(resolve => setTimeout(resolve, 2000));
          }
        }

        // 关键修复：如果数据库查询失败，直接从 demo 文件读取 tickrate
        if (!matchResult) {
          console.log('[DEBUG] ⚠️ Database query failed after 5 attempts');
          console.log('[DEBUG] Step 6: Fallback - reading demo file directly to get tickrate...');

          try {
            const demoInfo = await getDemoFromFilePath(demoPath);
            console.log(`[DEBUG] ✓ Demo file read successfully!`);
            console.log(`[DEBUG]   - tickrate: ${demoInfo.tickrate}`);
            console.log(`[DEBUG]   - name: ${demoInfo.name}`);
            console.log(`[DEBUG]   - map: ${demoInfo.mapName}`);

            // 使用 demo 文件中的数据代替数据库查询结果
            matchResult = {
              tickrate: demoInfo.tickrate,
              name: demoInfo.name
            };
            console.log('[DEBUG] ✓ Using demo file data as fallback (bypassing checksum verification)');
          } catch (fallbackError) {
            console.error('[DEBUG] ✗ Fallback failed - cannot read demo file');
            console.error(`[DEBUG] Error: ${fallbackError instanceof Error ? fallbackError.message : fallbackError}`);
            console.error('[CRITICAL] Cannot proceed without tickrate. Skipping this demo.');
            continue;
          }
        }

        // 确定输出目录
        const outputFolder = this.outputFolderPath ?? path.join(path.dirname(demoPath), 'training_data');

        console.log('[DEBUG] Step 7: Exporting training data...');
        console.log(`[DEBUG]   - Output folder: ${outputFolder}`);
        console.log(`[DEBUG]   - Tickrate: ${matchResult.tickrate}`);
        console.log(`[DEBUG]   - Window: ${this.windowMs}ms, ${this.framesPerWindow} frames`);
        console.log(`[DEBUG]   - Players: ${this.playerSteamIds.length > 0 ? this.playerSteamIds.join(',') : 'ALL'}`);
        console.log(`[DEBUG]   - Rounds: ${this.roundNumbers.length > 0 ? this.roundNumbers.join(',') : 'ALL'}`);

        // 导出训练数据
        await exportAllPlayersTrainingData({
          checksum,
          demoPath,
          outputFolderPath: outputFolder,
          tickrate: matchResult.tickrate,
          windowMs: this.windowMs,
          framesPerWindow: this.framesPerWindow,
          framesDir: this.framesDir,
          playerSteamIds: this.playerSteamIds.length > 0 ? this.playerSteamIds : undefined,
          roundNumbers: this.roundNumbers.length > 0 ? this.roundNumbers : undefined,
        });

        console.log('[DEBUG] ✓ Export completed successfully!');
        console.log('[DEBUG] ====== Demo processing completed ======\n');
      } catch (error) {
        console.error('[ERROR] ====== Demo processing failed ======');
        if (error instanceof Error) {
          console.error(`[ERROR] Message: ${error.message}`);
          console.error(`[ERROR] Stack: ${error.stack}`);
        } else {
          console.error(`[ERROR] Unknown error: ${error}`);
        }
        console.error('[ERROR] ======================================\n');
      }
    }
  }

  protected async parseArgs() {
    super.parseArgs(this.args);

    if (this.args.length === 0) {
      console.log('No demo path provided');
      this.printHelp();
      this.exitWithFailure();
    }

    for (let index = 0; index < this.args.length; index++) {
      const arg = this.args[index];

      if (this.isFlagArgument(arg)) {
        switch (arg) {
          case this.forceFlag:
            this.forceAnalyze = true;
            break;

          case this.listPlayersFlag:
            this.listPlayersOnly = true;
            break;

          case this.roundsFlag:
            if (this.args.length > index + 1) {
              index += 1;
              this.roundNumbers = this.args[index].split(',').map((n) => {
                const num = parseInt(n.trim(), 10);
                if (isNaN(num) || num < 1) {
                  console.log(`Invalid round number: ${n}`);
                  this.exitWithFailure();
                }
                return num;
              });
            } else {
              console.log(`Missing ${this.roundsFlag} value`);
              this.exitWithFailure();
            }
            break;

          case this.outputFlag:
            if (this.args.length > index + 1) {
              index += 1;
              this.outputFolderPath = this.args[index];
            } else {
              console.log(`Missing ${this.outputFlag} value`);
              this.exitWithFailure();
            }
            break;

          case this.playersFlag:
            if (this.args.length > index + 1) {
              index += 1;
              this.playerSteamIds = this.args[index].split(',').map((id) => id.trim());
            } else {
              console.log(`Missing ${this.playersFlag} value`);
              this.exitWithFailure();
            }
            break;

          case this.windowFlag:
            if (this.args.length > index + 1) {
              index += 1;
              const ms = parseInt(this.args[index], 10);
              if (isNaN(ms) || ms < 50 || ms > 5000) {
                console.log('Window must be between 50 and 5000 ms');
                this.exitWithFailure();
              }
              this.windowMs = ms;
            } else {
              console.log(`Missing ${this.windowFlag} value`);
              this.exitWithFailure();
            }
            break;

          case this.framesFlag:
            if (this.args.length > index + 1) {
              index += 1;
              const frames = parseInt(this.args[index], 10);
              if (isNaN(frames) || frames < 1 || frames > 100) {
                console.log('Frames per window must be between 1 and 100');
                this.exitWithFailure();
              }
              this.framesPerWindow = frames;
            } else {
              console.log(`Missing ${this.framesFlag} value`);
              this.exitWithFailure();
            }
            break;

          case this.framesDirFlag:
            if (this.args.length > index + 1) {
              index += 1;
              this.framesDir = this.args[index];
            } else {
              console.log(`Missing ${this.framesDirFlag} value`);
              this.exitWithFailure();
            }
            break;

          case this.sourceFlag:
            if (this.args.length > index + 1) {
              index += 1;
              const source = this.args[index] as DemoSource;
              const isValidSource = SupportedDemoSources.includes(source);
              if (!isValidSource) {
                console.log(`Invalid source ${source}`);
                this.exitWithFailure();
              }
              this.source = source;
            } else {
              console.log(`Missing ${this.sourceFlag} value`);
              this.exitWithFailure();
            }
            break;

          default:
            console.log(`Unknown flag: ${arg}`);
            this.exitWithFailure();
        }
      } else {
        // 处理demo路径
        try {
          const stats = await fs.stat(arg);
          if (stats.isDirectory()) {
            const files = await glob('*.dem', {
              cwd: arg,
              absolute: true,
            });
            this.demoPaths.push(...files);
          } else if (stats.isFile() && arg.endsWith('.dem')) {
            this.demoPaths.push(arg);
          } else {
            console.log(`Invalid path: ${arg}`);
            this.exitWithFailure();
          }
        } catch (error) {
          console.log(`Invalid path: ${arg}`);
          this.exitWithFailure();
        }
      }
    }
  }

  private async analyzeDemo(demoPath: string) {
    console.log('  Analyzing demo (with positions)...');
    await runDemoAnalyzer({
      demoPath,
      outputFolderPath: this.temporaryFolderPath,
      analyzePositions: this.analyzePositions,
      onStart: () => {},
      onStderr: (output) => {
        console.error(`  Analyzer error: ${output}`);
      },
      source: this.source,
    });
  }

  private async insertMatchInDatabase(checksum: string, demoPath: string) {
    console.log('  Inserting into database...');
    await processMatchInsertion({
      checksum,
      demoPath,
      outputFolderPath: this.temporaryFolderPath,
    });
  }
}
