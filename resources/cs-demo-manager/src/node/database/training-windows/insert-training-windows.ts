import { db } from 'csdm/node/database/database';
import type { InsertableTrainingWindowRow } from 'csdm/node/database/training-windows/training-window-table';

/**
 * 插入训练窗口数据到数据库
 */
export async function insertTrainingWindows(windows: InsertableTrainingWindowRow[]): Promise<void> {
  if (windows.length === 0) {
    return;
  }

  // 批量插入，每次最多1000条
  const batchSize = 1000;
  for (let i = 0; i < windows.length; i += batchSize) {
    const batch = windows.slice(i, i + batchSize);
    await db.insertInto('training_windows').values(batch).execute();
  }
}

/**
 * 删除指定比赛的训练数据
 */
export async function deleteTrainingDataByChecksum(checksum: string): Promise<void> {
  await db.deleteFrom('training_windows').where('match_checksum', '=', checksum).execute();
}

/**
 * 删除指定比赛、指定回合的训练数据
 */
export async function deleteTrainingDataByRound(checksum: string, roundNumber: number): Promise<void> {
  await db
    .deleteFrom('training_windows')
    .where('match_checksum', '=', checksum)
    .where('round_number', '=', roundNumber)
    .execute();
}

/**
 * 检查指定比赛是否已有训练数据
 */
export async function hasTrainingData(checksum: string): Promise<boolean> {
  const result = await db
    .selectFrom('training_windows')
    .select(db.fn.count('id').as('count'))
    .where('match_checksum', '=', checksum)
    .executeTakeFirst();

  return result ? Number(result.count) > 0 : false;
}

/**
 * 获取指定比赛的训练数据统计
 */
export async function getTrainingDataStats(checksum: string) {
  const result = await db
    .selectFrom('training_windows')
    .select([
      db.fn.count('id').as('total_windows'),
      db.fn.countDistinct('player_steam_id').as('total_players'),
      db.fn.countDistinct('round_number').as('total_rounds'),
    ])
    .where('match_checksum', '=', checksum)
    .executeTakeFirst();

  return {
    totalWindows: result ? Number(result.total_windows) : 0,
    totalPlayers: result ? Number(result.total_players) : 0,
    totalRounds: result ? Number(result.total_rounds) : 0,
  };
}
