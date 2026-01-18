import { sql } from 'kysely';
import { db } from 'csdm/node/database/database';
export async function fetchTeamsTable(filter) {
    const { count, sum, avg, max } = db.fn;
    let query = db
        .selectFrom('teams')
        .select([
        'teams.name as name',
        count('teams.match_checksum').distinct().as('matchCount'),
        sum('players.kill_count').as('killCount'),
        sum('players.death_count').as('deathCount'),
        sum('players.assist_count').as('assistCount'),
        sum('players.headshot_count').as('headshotCount'),
        sum('three_kill_count').as('threeKillCount'),
        sum('four_kill_count').as('fourKillCount'),
        sum('five_kill_count').as('fiveKillCount'),
        avg('headshot_percentage').as('headshotPercentage'),
        avg('kast').as('kast'),
        sql `SUM(players.kill_count)::NUMERIC / NULLIF(SUM(players.death_count), 0)::NUMERIC`.as('killDeathRatio'),
        avg('hltv_rating').as('hltvRating'),
        avg('hltv_rating_2').as('hltvRating2'),
        avg('average_damage_per_round').as('averageDamagePerRound'),
    ])
        .leftJoin('matches', 'matches.checksum', 'teams.match_checksum')
        .select([max(sql `to_char(matches.date, 'YYYY-MM-DD"T"HH24:MI:SS.MS"Z"')`).as('lastMatchDate')])
        .leftJoin('players', (join) => {
        return join
            .onRef('players.match_checksum', '=', 'teams.match_checksum')
            .onRef('players.team_name', '=', 'teams.name');
    })
        .orderBy('teams.name')
        .groupBy(['teams.name']);
    const { startDate, endDate } = filter;
    if (startDate && endDate) {
        query = query.where(sql `matches.date between ${startDate} and ${endDate}`);
    }
    const teams = await query.execute();
    return teams;
}
//# sourceMappingURL=fetch-teams-table.js.map