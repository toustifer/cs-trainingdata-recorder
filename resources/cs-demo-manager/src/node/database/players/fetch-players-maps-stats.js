import { sql } from 'kysely';
import { db } from 'csdm/node/database/database';
import { applyMatchFilters } from '../match/apply-match-filters';
function buildStatsQuery(steamIds, filters) {
    const { count, avg } = db.fn;
    let query = db
        .selectFrom('matches')
        .innerJoin('players', 'players.match_checksum', 'matches.checksum')
        .select([
        'players.steam_id as steamId',
        'matches.map_name as mapName',
        sql `COUNT(matches.checksum) FILTER (WHERE matches.winner_name = players.team_name)`.as('winCount'),
        sql `COUNT(matches.checksum) FILTER (WHERE matches.winner_name IS NOT NULL AND matches.winner_name != players.team_name)`.as('lostCount'),
        sql `COUNT(matches.checksum) FILTER (WHERE matches.winner_name IS NULL)`.as('tiedCount'),
        count('matches.checksum').as('matchCount'),
        sql `SUM(players.kill_count)::NUMERIC / NULLIF(SUM(players.death_count), 0)::NUMERIC`.as('killDeathRatio'),
        avg('players.average_damage_per_round').as('averageDamagesPerRound'),
        avg('players.kast').as('kast'),
        avg('players.headshot_percentage').as('headshotPercentage'),
    ])
        .where('players.steam_id', 'in', steamIds)
        .orderBy('steamId')
        .orderBy('mapName')
        .groupBy(['mapName', 'steamId']);
    if (filters) {
        query = applyMatchFilters(query, filters);
    }
    return query;
}
function buildRoundsQuery(steamIds, filters) {
    const { count } = db.fn;
    let query = db
        .selectFrom('rounds')
        .innerJoin('matches', 'rounds.match_checksum', 'matches.checksum')
        .innerJoin('players', 'players.match_checksum', 'matches.checksum')
        .select([
        'players.steam_id as steamId',
        'matches.map_name as mapName',
        sql `COUNT(rounds.id) FILTER (WHERE rounds.winner_name = players.team_name)`.as('roundWinCount'),
        sql `COUNT(rounds.id) FILTER (WHERE rounds.winner_name IS NOT NULL AND rounds.winner_name != players.team_name)`.as('roundLostCount'),
        sql `COUNT(rounds.id) FILTER (WHERE rounds.winner_name = players.team_name AND rounds.winner_side = 3)`.as('roundWinCountAsCt'),
        sql `COUNT(rounds.id) FILTER (WHERE rounds.winner_name = players.team_name AND rounds.winner_side = 2)`.as('roundWinCountAsT'),
        sql `COUNT(rounds.id) FILTER (WHERE rounds.winner_side = 2)`.as('roundCountAsT'),
        sql `COUNT(rounds.id) FILTER (WHERE rounds.winner_side = 3)`.as('roundCountAsCt'),
        count('rounds.id').as('roundCount'),
    ])
        .where('players.steam_id', 'in', steamIds)
        .orderBy('steamId')
        .orderBy('mapName')
        .groupBy(['mapName', 'steamId']);
    if (filters) {
        query = applyMatchFilters(query, filters);
    }
    return query;
}
export async function fetchPlayersMapsStats(steamIds, filters) {
    const globalQuery = buildStatsQuery(steamIds, filters);
    const roundsQuery = buildRoundsQuery(steamIds, filters);
    const [globalStats, roundsStats] = await Promise.all([
        globalQuery.execute(),
        roundsQuery.execute(),
    ]);
    const stats = [];
    for (const matchStats of globalStats) {
        const roundStats = roundsStats.find((roundStats) => {
            return roundStats.mapName === matchStats.mapName && roundStats.steamId === matchStats.steamId;
        });
        if (roundStats !== undefined) {
            stats.push({
                ...matchStats,
                ...roundStats,
            });
        }
    }
    return stats;
}
//# sourceMappingURL=fetch-players-maps-stats.js.map