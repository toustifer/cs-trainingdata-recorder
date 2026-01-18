import { Command } from './command';
import { db } from 'csdm/node/database/database';
import { generateVideo } from 'csdm/node/video/generation/generate-video';
import { getSettings } from 'csdm/node/settings/get-settings';
import { fetchDemoByChecksum } from 'csdm/node/database/demos/fetch-demo-by-checksum';
import { Game } from 'csdm/common/types/counter-strike';
import { RecordingSystem } from 'csdm/common/types/recording-system';
import { RecordingOutput } from 'csdm/common/types/recording-output';
import { EncoderSoftware } from 'csdm/common/types/encoder-software';
import type { Sequence } from 'csdm/common/types/sequence';
import { randomUUID } from 'node:crypto';
import path from 'node:path';

export class GenerateFramesCommand extends Command {
  public static Name = 'generate-frames';
  private checksum: string | undefined;
  private playerSteamIds: string[] = [];
  private roundNumbers: number[] = [];

  public getDescription() {
    return 'Generate video frames based on training data in database';
  }

  public printHelp() {
    console.log(this.getDescription());
    console.log('');
    console.log(`Usage: csdm ${GenerateFramesCommand.Name} [options]`);
    console.log('');
    console.log('Options:');
    console.log('  --checksum <checksum>  Demo checksum (required)');
    console.log('  --players <ids>        Comma-separated Steam IDs (default: all)');
    console.log('  --rounds <numbers>     Comma-separated round numbers (default: all)');
    console.log('');
    console.log('Examples:');
    console.log('');
    console.log('Generate frames for all players and rounds:');
    console.log(`  csdm ${GenerateFramesCommand.Name} --checksum abc123`);
    console.log('');
    console.log('Generate frames for specific player:');
    console.log(`  csdm ${GenerateFramesCommand.Name} --checksum abc123 --players 76561198000000001`);
  }

  public async run() {
    await this.parseArgs();

    if (!this.checksum) {
      console.error('Error: --checksum is required');
      this.printHelp();
      this.exitWithFailure();
    }

    await this.initDatabaseConnection();
    const settings = await getSettings();

    // 获取 demo 信息
    const demo = await fetchDemoByChecksum(this.checksum);
    if (!demo) {
      console.error(`Error: Demo not found for checksum ${this.checksum}`);
      this.exitWithFailure();
    }

    console.log(`Demo: ${demo.name}`);
    console.log(`Tickrate: ${demo.tickrate}`);
    console.log('');

    // 查询需要录制的回合
    let query = db
      .selectFrom('training_windows')
      .select(['round_number', 'player_steam_id', 'player_name'])
      .select([
        (eb) => eb.fn.min('start_tick').as('video_start_tick'),
        (eb) => eb.fn.max('end_tick').as('video_end_tick'),
        (eb) => eb.fn.count('id').as('total_windows'),
      ])
      .where('match_checksum', '=', this.checksum)
      .groupBy(['round_number', 'player_steam_id', 'player_name'])
      .orderBy('round_number', 'asc')
      .orderBy('player_steam_id', 'asc');

    if (this.playerSteamIds.length > 0) {
      query = query.where('player_steam_id', 'in', this.playerSteamIds);
    }

    if (this.roundNumbers.length > 0) {
      query = query.where('round_number', 'in', this.roundNumbers);
    }

    const recordingTasks = await query.execute();

    if (recordingTasks.length === 0) {
      console.log('No training data found for recording.');
      this.exitWithFailure();
    }

    console.log(`Found ${recordingTasks.length} recording task(s):`);
    for (const task of recordingTasks) {
      console.log(
        `  Round ${task.round_number}, ${task.player_name}: tick ${task.video_start_tick}-${task.video_end_tick} (${task.total_windows} windows)`,
      );
    }
    console.log('');

    // 为每个任务生成视频序列并录制
    for (const task of recordingTasks) {
      console.log(`\nRecording: Round ${task.round_number} - ${task.player_name}...`);

      // 查询该任务的输出路径（从第一个窗口获取）
      const firstWindow = await db
        .selectFrom('training_windows')
        .select('start_frame_path')
        .where('match_checksum', '=', this.checksum)
        .where('round_number', '=', task.round_number)
        .where('player_steam_id', '=', task.player_steam_id)
        .orderBy('window_idx', 'asc')
        .limit(1)
        .executeTakeFirst();

      if (!firstWindow) {
        console.error(`  Error: Cannot find frame path for this task`);
        continue;
      }

      // 从帧路径推断输出目录
      // 例如：D:\...\frames\frame_0001.jpg -> D:\...\frames
      const outputFolderPath = path.dirname(firstWindow.start_frame_path);

      const sequence: Sequence = {
        number: 1,
        startTick: Number(task.video_start_tick),
        endTick: Number(task.video_end_tick),
        showXRay: true,
        showAssists: false,
        showOnlyDeathNotices: false,
        deathNoticesDuration: 5,
        playersOptions: [],
        playerCameras: [
          {
            tick: Number(task.video_start_tick),
            playerSteamId: task.player_steam_id,
            playerName: task.player_name,
          },
        ],
        cameras: [],
        playerVoicesEnabled: false,
        recordAudio: false,
        cfg: '',
      };

      const abortController = new AbortController();

      try {
        await generateVideo({
          videoId: randomUUID(),
          checksum: this.checksum,
          game: demo.game as Game,
          tickrate: demo.tickrate,
          recordingSystem: settings.video.recordingSystem ?? RecordingSystem.HLAE,
          recordingOutput: RecordingOutput.Images, // 只输出图片
          encoderSoftware: settings.video.encoderSoftware ?? EncoderSoftware.FFmpeg,
          framerate: 25, // 25fps
          width: settings.video.width,
          height: settings.video.height,
          closeGameAfterRecording: true,
          concatenateSequences: false,
          ffmpegSettings: settings.video.ffmpegSettings,
          outputFolderPath,
          demoPath: demo.path,
          sequences: [sequence],
          signal: abortController.signal,
          onGameStart: () => console.log('  Game starting...'),
          onMoveFilesStart: () => console.log('  Moving files...'),
          onSequenceStart: (n) => console.log(`  Recording sequence ${n}...`),
          onConcatenateSequencesStart: () => {},
        });

        console.log(`  ✓ Recording completed: ${outputFolderPath}`);
      } catch (error) {
        console.error(`  ✗ Recording failed:`, error);
      }
    }

    console.log('\nAll recordings completed!');
    process.exit(0);
  }

  protected async parseArgs() {
    super.parseArgs(this.args);

    for (let i = 0; i < this.args.length; i++) {
      const arg = this.args[i];

      if (arg === '--checksum' && i + 1 < this.args.length) {
        this.checksum = this.args[i + 1];
        i++;
      } else if (arg === '--players' && i + 1 < this.args.length) {
        this.playerSteamIds = this.args[i + 1].split(',').map((id) => id.trim());
        i++;
      } else if (arg === '--rounds' && i + 1 < this.args.length) {
        this.roundNumbers = this.args[i + 1].split(',').map((n) => parseInt(n.trim(), 10));
        i++;
      }
    }
  }
}
