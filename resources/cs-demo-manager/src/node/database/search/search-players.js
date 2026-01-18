import { db } from 'csdm/node/database/database';
export async function searchPlayers({ steamIdOrName, ignoredSteamIds }) {
    const query = db
        .selectFrom('players')
        .select(['players.steam_id', 'players.name'])
        .distinctOn(['players.steam_id'])
        .where(({ eb, or, and }) => {
        const filters = [
            or([eb('players.steam_id', '=', steamIdOrName), eb('players.name', 'ilike', `%${steamIdOrName}%`)]),
        ];
        if (ignoredSteamIds.length > 0) {
            filters.push(eb('players.steam_id', 'not in', ignoredSteamIds));
        }
        return and(filters);
    })
        .limit(20);
    const rows = await query.execute();
    const players = rows.map((row) => {
        return {
            name: row.name,
            steamId: row.steam_id,
        };
    });
    return players;
}
//# sourceMappingURL=search-players.js.map