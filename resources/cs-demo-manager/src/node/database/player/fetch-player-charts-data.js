import { sql } from 'kysely';
import { db } from 'csdm/node/database/database';
import { applyMatchFilters } from '../match/apply-match-filters';
export async function fetchPlayerChartsData(steamId, filters) {
    let query = db
        .selectFrom('players')
        .select([
        'headshot_percentage as headshotPercentage',
        'average_damage_per_round as averageDamagePerRound',
        'kill_death_ratio as killDeathRatio',
    ])
        .leftJoin('matches', 'matches.checksum', 'players.match_checksum')
        .select(sql `to_char(matches.date, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')`.as('matchDate'))
        .leftJoin('clutches', function (qb) {
        return qb
            .onRef('clutches.match_checksum', '=', 'players.match_checksum')
            .onRef('players.steam_id', '=', 'clutches.clutcher_steam_id');
    })
        .select([
        sql `ROUND(COUNT(clutches.id) FILTER (WHERE clutches.won = TRUE) * 100.0 / GREATEST(COUNT(clutches.id), 1), 1)::numeric`.as('clutchWonPercentage'),
    ])
        .where('steam_id', '=', steamId)
        .groupBy(['headshotPercentage', 'averageDamagePerRound', 'killDeathRatio', 'matches.date'])
        .orderBy('date', 'asc');
    query = applyMatchFilters(query, filters);
    const data = await query.execute();
    return data;
}
//# sourceMappingURL=fetch-player-charts-data.js.map