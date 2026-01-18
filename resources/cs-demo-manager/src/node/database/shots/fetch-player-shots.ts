import { db } from 'csdm/node/database/database';
import type { Shot } from 'csdm/common/types/shot';
import { shotRowToShot } from './shot-row-to-shot';

/**
 * 获取单个玩家在指定回合的shots（减少内存使用）
 */
export async function fetchPlayerShots(
  checksum: string,
  roundNumber: number,
  playerSteamId: string,
): Promise<Shot[]> {
  const rows = await db
    .selectFrom('shots')
    .selectAll()
    .leftJoin('steam_account_overrides', 'shots.player_steam_id', 'steam_account_overrides.steam_id')
    .select([db.fn.coalesce('steam_account_overrides.name', 'shots.player_name').as('player_name')])
    .where('match_checksum', '=', checksum)
    .where('round_number', '=', roundNumber)
    .where('player_steam_id', '=', playerSteamId)
    .execute();

  return rows.map(shotRowToShot);
}
