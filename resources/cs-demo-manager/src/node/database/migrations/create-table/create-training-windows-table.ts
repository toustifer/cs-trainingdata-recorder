import type { Transaction } from 'kysely';
import type { Database } from '../../schema';

export async function createTrainingWindowsTable(transaction: Transaction<Database>) {
  await transaction.schema
    .createTable('training_windows')
    .ifNotExists()
    .addColumn('id', 'bigserial', (col) => col.primaryKey().notNull())
    .addColumn('match_checksum', 'varchar', (col) => col.notNull())
    .addForeignKeyConstraint(
      'training_windows_match_checksum_fk',
      ['match_checksum'],
      'matches',
      ['checksum'],
      (cb) => cb.onDelete('cascade'),
    )
    .addColumn('round_number', 'integer', (col) => col.notNull())
    .addColumn('player_steam_id', 'varchar', (col) => col.notNull())
    .addColumn('player_name', 'varchar', (col) => col.notNull())
    .addColumn('window_idx', 'integer', (col) => col.notNull())
    .addColumn('start_tick', 'integer', (col) => col.notNull())
    .addColumn('end_tick', 'integer', (col) => col.notNull())
    .addColumn('time_ms', 'integer', (col) => col.notNull())

    // 玩家状态
    .addColumn('pos_x', 'float8', (col) => col.notNull())
    .addColumn('pos_y', 'float8', (col) => col.notNull())
    .addColumn('pos_z', 'float8', (col) => col.notNull())
    .addColumn('view_pitch', 'float8', (col) => col.notNull())
    .addColumn('view_yaw', 'float8', (col) => col.notNull())
    .addColumn('health', 'integer', (col) => col.notNull())
    .addColumn('armor', 'integer', (col) => col.notNull())
    .addColumn('weapon', 'varchar', (col) => col.notNull())
    .addColumn('is_alive', 'boolean', (col) => col.notNull())
    .addColumn('is_scoped', 'boolean', (col) => col.notNull())
    .addColumn('is_crouching', 'boolean', (col) => col.notNull())
    .addColumn('is_defusing', 'boolean', (col) => col.notNull())
    .addColumn('is_planting', 'boolean', (col) => col.notNull())
    .addColumn('flash_duration', 'float8', (col) => col.notNull())
    .addColumn('team', 'varchar', (col) => col.notNull())
    .addColumn('money', 'integer', (col) => col.notNull())

    // 移动状态
    .addColumn('is_moving', 'boolean', (col) => col.notNull())
    .addColumn('move_direction', 'varchar', (col) => col.notNull())
    .addColumn('move_speed', 'float8', (col) => col.notNull())

    // 情况描述
    .addColumn('situation_text', 'text', (col) => col.notNull())

    // 事件数据（JSON）
    .addColumn('events_json', 'text', (col) => col.notNull())
    .addColumn('events_zh', 'text', (col) => col.notNull())

    // 帧路径
    .addColumn('start_frame_path', 'varchar', (col) => col.notNull())
    .addColumn('middle_frame_paths', 'text', (col) => col.notNull())
    .addColumn('end_frame_path', 'varchar', (col) => col.notNull())
    .execute();

  // 创建索引以加速查询
  await transaction.schema
    .createIndex('training_windows_match_checksum_idx')
    .ifNotExists()
    .on('training_windows')
    .columns(['match_checksum'])
    .execute();

  await transaction.schema
    .createIndex('training_windows_player_round_idx')
    .ifNotExists()
    .on('training_windows')
    .columns(['match_checksum', 'player_steam_id', 'round_number'])
    .execute();
}
