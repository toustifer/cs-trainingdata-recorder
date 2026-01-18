import { db } from 'csdm/node/database/database';
import { playerBlindRowToPlayerBlind } from './player-blind-row-to-player-blind';
import type { PlayerBlind } from 'csdm/common/types/player-blind';

export async function fetchPlayerBlinds(checksum: string, roundNumber?: number) {
  let query = db.selectFrom('player_blinds').selectAll().where('match_checksum', '=', checksum);

  if (typeof roundNumber === 'number') {
    query = query.where('round_number', '=', roundNumber);
  }

  const rows = await query.execute();
  const playerBlinds: PlayerBlind[] = rows.map((row) => {
    return playerBlindRowToPlayerBlind(row);
  });

  return playerBlinds;
}
