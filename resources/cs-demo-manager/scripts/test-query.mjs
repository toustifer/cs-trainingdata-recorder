import pg from 'pg';
import { getSettings } from '../src/node/settings/get-settings.js';

async function main() {
  const settings = await getSettings();
  const dbSettings = settings.database;

  const client = new pg.Client({
    host: dbSettings.hostname,
    port: dbSettings.port,
    database: dbSettings.database,
    user: dbSettings.username,
    password: dbSettings.password,
  });

  await client.connect();

  // 检查位置数据量
  const result = await client.query(`
    SELECT COUNT(*) as count
    FROM player_positions
    WHERE round_number = 1
  `);
  console.log('Round 1 positions count:', result.rows[0].count);

  const result2 = await client.query(`
    SELECT COUNT(*) as count
    FROM player_positions
    WHERE round_number = 1 AND player_steam_id = '76561198076696741'
  `);
  console.log('Round 1 single player positions:', result2.rows[0].count);

  await client.end();
}

main().catch(console.error);
