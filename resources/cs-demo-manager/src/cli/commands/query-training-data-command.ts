import { Command } from './command';
import { db } from 'csdm/node/database/database';

export class QueryTrainingDataCommand extends Command {
  public static Name = 'query-training';
  private checksum: string | undefined;
  private limit = 3;

  public getDescription() {
    return 'Query training data from database';
  }

  public printHelp() {
    console.log(this.getDescription());
    console.log('');
    console.log(`Usage: csdm ${QueryTrainingDataCommand.Name} [options]`);
    console.log('');
    console.log('Options:');
    console.log('  --checksum <checksum>  Filter by demo checksum');
    console.log('  --limit <n>           Number of records to show (default: 3)');
  }

  public async run() {
    await this.parseArgs();
    await this.initDatabaseConnection();

    // 查询统计信息
    const countResult = await db
      .selectFrom('training_windows')
      .select(db.fn.count('id').as('total'))
      .executeTakeFirst();

    const players = await db
      .selectFrom('training_windows')
      .select('player_steam_id')
      .distinct()
      .execute();

    const rounds = await db
      .selectFrom('training_windows')
      .select('round_number')
      .distinct()
      .execute();

    // 获取 checksum
    const checksumResult = await db
      .selectFrom('training_windows')
      .select('match_checksum')
      .limit(1)
      .executeTakeFirst();

    console.log('=== 训练数据统计 ===');
    console.log(`Demo Checksum: ${checksumResult?.match_checksum || 'N/A'}`);
    console.log(`总窗口数: ${countResult?.total || 0}`);
    console.log(`玩家数: ${players.length}`);
    console.log(`回合数: ${rounds.length}`);
    console.log('');

    // 查询示例记录
    let query = db
      .selectFrom('training_windows')
      .selectAll()
      .orderBy('window_idx', 'asc')
      .limit(this.limit);

    if (this.checksum) {
      query = query.where('match_checksum', '=', this.checksum);
    }

    const records = await query.execute();

    console.log(`=== 示例记录 (前${records.length}条) ===`);
    for (const r of records) {
      console.log(`\n[窗口 ${r.window_idx}] 回合${r.round_number} - ${r.player_name}`);
      console.log(`  Steam ID: ${r.player_steam_id}`);
      console.log(`  Tick: ${r.start_tick} - ${r.end_tick} (时间: ${r.time_ms}ms)`);
      console.log(`  起始帧: ${r.start_frame_path}`);
      const middleFrames = JSON.parse(r.middle_frame_paths as string);
      console.log(`  中间帧: ${middleFrames.length}个`);
      console.log(`    ${middleFrames.slice(0, 2).join('\n    ')}...`);
      console.log(`  结束帧: ${r.end_frame_path}`);
      console.log(`  Situation: ${r.situation_text}`);
      console.log(`  事件: ${r.events_zh || '无'}`);
    }

    process.exit(0);
  }

  protected async parseArgs() {
    super.parseArgs(this.args);

    for (let i = 0; i < this.args.length; i++) {
      const arg = this.args[i];

      if (arg === '--checksum' && i + 1 < this.args.length) {
        this.checksum = this.args[i + 1];
        i++;
      } else if (arg === '--limit' && i + 1 < this.args.length) {
        this.limit = parseInt(this.args[i + 1], 10);
        i++;
      }
    }
  }
}
