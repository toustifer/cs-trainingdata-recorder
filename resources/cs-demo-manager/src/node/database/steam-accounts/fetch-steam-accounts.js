import { db } from 'csdm/node/database/database';
export async function fetchSteamAccounts(steamIds) {
    const accounts = await db.selectFrom('steam_accounts').selectAll().where('steam_id', 'in', steamIds).execute();
    return accounts;
}
//# sourceMappingURL=fetch-steam-accounts.js.map