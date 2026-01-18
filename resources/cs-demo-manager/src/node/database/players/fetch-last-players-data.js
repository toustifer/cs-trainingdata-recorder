import { db } from '../database';
export async function fetchLastPlayersData(steamIds) {
    if (steamIds.length === 0) {
        return [];
    }
    const lastPlayersData = await db
        .selectFrom('players')
        .select([
        'players.steam_id as steamId',
        'players.name as name',
        'players.rank as rank',
        'players.wins_count as winsCount',
    ])
        .leftJoin('steam_accounts', 'steam_accounts.steam_id', 'players.steam_id')
        .leftJoin('steam_account_overrides', 'players.steam_id', 'steam_account_overrides.steam_id')
        .select([
        db.fn.coalesce('steam_account_overrides.name', 'steam_accounts.name').as('lastKnownName'),
        'avatar',
        'last_ban_date as lastBanDate',
        'is_community_banned as isCommunityBanned',
        'vac_ban_count as vacBanCount',
        'game_ban_count as gameBanCount',
        'economy_ban as economyBan',
    ])
        .innerJoin('matches', 'matches.checksum', 'players.match_checksum')
        .select(['matches.date as lastMatchDate', 'matches.game as game'])
        .where((eb) => eb('players.steam_id', '=', eb.fn.any(eb.val(steamIds))))
        .groupBy([
        'matches.checksum',
        'players.steam_id',
        'players.name',
        'players.rank',
        'players.wins_count',
        'lastKnownName',
        'steam_accounts.avatar',
        'lastBanDate',
        'isCommunityBanned',
        'vacBanCount',
        'gameBanCount',
        'economyBan',
    ])
        .orderBy('matches.date', 'desc')
        .execute();
    return lastPlayersData;
}
//# sourceMappingURL=fetch-last-players-data.js.map