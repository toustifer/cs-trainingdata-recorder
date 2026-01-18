import { sql } from 'kysely';
import { db } from 'csdm/node/database/database';
import { BanFilter } from 'csdm/common/types/ban-filter';
import { fetchPlayersTags } from 'csdm/node/database/tags/fetch-players-tags';
import { fetchLastPlayersData } from './fetch-last-players-data';
async function fetchPlayersStats(filter) {
    const { count, sum, avg } = db.fn;
    let query = db
        .selectFrom('players')
        .select([
        'players.steam_id as steamId',
        sum('players.kill_count').as('killCount'),
        sum('players.death_count').as('deathCount'),
        sql `SUM(players.kill_count)::NUMERIC / NULLIF(SUM(players.death_count), 0)::NUMERIC`.as('killDeathRatio'),
        sum('players.assist_count').as('assistCount'),
        sum('headshot_count').as('headshotCount'),
        sum('three_kill_count').as('threeKillCount'),
        sum('four_kill_count').as('fourKillCount'),
        sum('five_kill_count').as('fiveKillCount'),
        sum('mvp_count').as('mvpCount'),
        sum('utility_damage').as('utilityDamage'),
        avg('headshot_percentage').as('headshotPercentage'),
        avg('utility_damage_per_round').as('utilityDamagePerRound'),
        avg('kast').as('kast'),
        avg('hltv_rating').as('hltvRating'),
        avg('hltv_rating_2').as('hltvRating2'),
        avg('average_damage_per_round').as('averageDamagePerRound'),
        count('match_checksum').as('matchCount'),
    ])
        .leftJoin('player_comments', 'player_comments.steam_id', 'players.steam_id')
        .select('player_comments.comment')
        .leftJoin('matches', 'matches.checksum', 'players.match_checksum')
        .groupBy(['players.steam_id', 'player_comments.comment']);
    const { startDate, endDate, tagIds } = filter;
    if (startDate && endDate) {
        query = query.where(sql `matches.date between ${startDate} and ${endDate}`);
    }
    if (Array.isArray(tagIds) && tagIds.length > 0) {
        query = query
            .leftJoin('steam_account_tags', 'steam_account_tags.steam_id', 'players.steam_id')
            .where('steam_account_tags.tag_id', 'in', tagIds);
    }
    if (filter.bans.length > 0) {
        query = query
            .innerJoin('steam_accounts', 'steam_accounts.steam_id', 'players.steam_id')
            .where(({ eb, or, and }) => {
            const filters = [];
            if (filter.bans.includes(BanFilter.None)) {
                filters.push(and([eb('vac_ban_count', '=', 0), eb('game_ban_count', '=', 0), eb('is_community_banned', '=', false)]));
            }
            if (filter.bans.includes(BanFilter.VacBanned)) {
                filters.push(eb('vac_ban_count', '>', 0));
            }
            if (filter.bans.includes(BanFilter.GameBanned)) {
                filters.push(eb('game_ban_count', '>', 0));
            }
            if (filter.bans.includes(BanFilter.CommunityBanned)) {
                filters.push(eb('is_community_banned', '=', true));
            }
            return or(filters);
        });
    }
    const playersStats = await query.execute();
    return playersStats;
}
function buildPlayersTable(playersStats, lastPlayersData, tags) {
    const players = [];
    for (const playerStats of playersStats) {
        const lastPlayerData = lastPlayersData.find((row) => {
            return row.steamId === playerStats.steamId;
        });
        if (lastPlayerData) {
            players.push({
                ...playerStats,
                name: lastPlayerData.lastKnownName ?? lastPlayerData.name,
                avatar: lastPlayerData.avatar,
                rank: lastPlayerData.rank,
                game: lastPlayerData.game,
                lastBanDate: lastPlayerData.lastBanDate?.toISOString() ?? null,
                lastMatchDate: lastPlayerData.lastMatchDate?.toISOString() ?? null,
                isVacBanned: lastPlayerData.vacBanCount ? lastPlayerData.vacBanCount > 0 : false,
                isGameBanned: lastPlayerData.gameBanCount ? lastPlayerData.gameBanCount > 0 : false,
                isCommunityBanned: lastPlayerData.isCommunityBanned ?? false,
                comment: playerStats.comment ?? '',
                tagIds: tags
                    .filter((row) => {
                    return row.steam_id === playerStats.steamId;
                })
                    .map((tag) => String(tag.tag_id)),
            });
        }
        else {
            logger.warn(`Data for player with SteamID ${playerStats.steamId} not found while fetching players`);
        }
    }
    return players;
}
export async function fetchPlayersTable(filter) {
    const playersStats = await fetchPlayersStats(filter);
    const steamIds = playersStats.map((player) => player.steamId);
    const [lastPlayersData, tags] = await Promise.all([fetchLastPlayersData(steamIds), fetchPlayersTags()]);
    const players = buildPlayersTable(playersStats, lastPlayersData, tags);
    return players;
}
//# sourceMappingURL=fetch-players-table.js.map