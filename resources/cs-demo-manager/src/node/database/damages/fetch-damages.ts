import { db } from 'csdm/node/database/database';
import { damageRowToDamage } from './damage-row-to-damage';
import type { Damage } from 'csdm/common/types/damage';

export async function fetchDamages(checksum: string, roundNumber?: number) {
  let query = db.selectFrom('damages').selectAll().where('match_checksum', '=', checksum);

  if (typeof roundNumber === 'number') {
    query = query.where('round_number', '=', roundNumber);
  }

  const rows = await query.execute();
  const damages: Damage[] = rows.map(damageRowToDamage);

  return damages;
}
