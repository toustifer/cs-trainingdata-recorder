import { db } from 'csdm/node/database/database';
export async function deleteIgnoredSteamAccount(steamId) {
    await db.deleteFrom('ignored_steam_accounts').where('steam_id', '=', steamId).execute();
}
//# sourceMappingURL=delete-ignored-steam-account.js.map