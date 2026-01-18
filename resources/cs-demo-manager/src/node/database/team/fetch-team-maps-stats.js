import { sql } from 'kysely';
import { db } from 'csdm/node/database/database';
import { applyMatchFilters } from '../match/apply-match-filters';
function buildMatchStatsQuery({ name, ...filters }) {
    const { count } = db.fn;
    let query = db
        .selectFrom('matches')
        .leftJoin('teams', 'teams.match_checksum', 'matches.checksum')
        .select([
        'matches.map_name as mapName',
        count('matches.checksum').distinct().as('matchCount'),
        sql `COUNT(CASE WHEN matches.winner_name = ${sql `${name}`} THEN 1 END)`.as('winCount'),
        sql `COUNT(CASE WHEN matches.winner_name IS NOT NULL AND matches.winner_name != ${sql `${name}`} THEN 1 END)`.as('lostCount'),
        sql `COUNT(CASE WHEN matches.winner_name IS NULL THEN 1 END)`.as('tiedCount'),
    ])
        .where('teams.name', '=', name)
        .groupBy('mapName');
    query = applyMatchFilters(query, filters);
    return query;
}
function buildStatsQuery({ name, ...filters }) {
    const { avg } = db.fn;
    let query = db
        .selectFrom('matches')
        .leftJoin('teams', 'teams.match_checksum', 'matches.checksum')
        .innerJoin('players', function (qb) {
        return qb.onRef('players.match_checksum', '=', 'matches.checksum').onRef('players.team_name', '=', 'teams.name');
    })
        .select([
        'matches.map_name as mapName',
        avg('players.kill_death_ratio').as('killDeathRatio'),
        avg('players.average_damage_per_round').as('averageDamagesPerRound'),
        avg('players.kast').as('kast'),
        avg('players.headshot_percentage').as('headshotPercentage'),
    ])
        .where('teams.name', '=', name)
        .groupBy('mapName');
    query = applyMatchFilters(query, filters);
    return query;
}
function buildRoundsQuery({ name, ...filters }) {
    const { count } = db.fn;
    let query = db
        .selectFrom('rounds')
        .innerJoin('matches', 'rounds.match_checksum', 'matches.checksum')
        .leftJoin('teams', 'teams.match_checksum', 'matches.checksum')
        .select([
        'matches.map_name as mapName',
        sql `COUNT(rounds.id) FILTER (WHERE rounds.winner_name = ${sql `${name}`})`.as('roundWinCount'),
        sql `COUNT(rounds.id) FILTER (WHERE rounds.winner_name IS NOT NULL AND rounds.winner_name != ${sql `${name}`})`.as('roundLostCount'),
        sql `COUNT(rounds.id) FILTER (WHERE rounds.winner_name = ${sql `${name}`} AND rounds.winner_side = 3)`.as('roundWinCountAsCt'),
        sql `COUNT(rounds.id) FILTER (WHERE rounds.winner_name = ${sql `${name}`} AND rounds.winner_side = 2)`.as('roundWinCountAsT'),
        sql `COUNT(rounds.id) FILTER (WHERE rounds.winner_side = 2)`.as('roundCountAsT'),
        sql `COUNT(rounds.id) FILTER (WHERE rounds.winner_side = 3)`.as('roundCountAsCt'),
        count('rounds.id').as('roundCount'),
    ])
        .where('teams.name', '=', name)
        .groupBy('mapName');
    query = applyMatchFilters(query, filters);
    return query;
}
export async function fetchTeamMapsStats(filters) {
    const statsQuery = buildStatsQuery(filters);
    const roundsQuery = buildRoundsQuery(filters);
    const matchStatsQuery = buildMatchStatsQuery(filters);
    const [matchesStats, playersStats, roundsStats] = await Promise.all([
        matchStatsQuery.execute(),
        statsQuery.execute(),
        roundsQuery.execute(),
    ]);
    const stats = [];
    for (const matchStats of matchesStats) {
        const roundStats = roundsStats.find((roundStats) => {
            return roundStats.mapName === matchStats.mapName;
        });
        const playerStats = playersStats.find((roundStats) => {
            return roundStats.mapName === matchStats.mapName;
        });
        if (roundStats && playerStats) {
            stats.push({
                ...matchStats,
                ...playerStats,
                ...roundStats,
            });
        }
    }
    return stats;
}
//# sourceMappingURL=fetch-team-maps-stats.js.map