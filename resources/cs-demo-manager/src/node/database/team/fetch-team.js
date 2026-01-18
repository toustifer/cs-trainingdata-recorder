import { sql } from 'kysely';
import { db } from 'csdm/node/database/database';
import { fetchTeamMatchCountStats } from './fetch-team-match-count-stats';
import { TeamNotFound } from './error/team-not-found';
import { fetchMatchesTable } from '../matches/fetch-matches-table';
import { fetchTeamCollateralKillCount } from './fetch-team-collateral-kill-count';
import { fetchTeamRoundCount } from './fetch-team-rounds-count';
import { fetchTeamLastMatches } from './fetch-team-last-matches';
import { fetchTeamClutches } from './fetch-team-clutches';
import { fetchTeamMapsStats } from './fetch-team-maps-stats';
import { fetchTeamEconomyStats } from './fetch-team-economy-stats';
import { applyMatchFilters } from '../match/apply-match-filters';
import { fetchTeamMatchSideStats } from './fetch-team-match-side-stats';
import { fetchTeamBombsStats } from './fetch-team-bombs-stats';
function buildQuery({ name, ...filters }) {
    const { count, avg, sum } = db.fn;
    let query = db
        .selectFrom('teams')
        .select([
        'teams.name as name',
        count('teams.match_checksum').distinct().as('matchCount'),
        sum('players.kill_count').as('killCount'),
        sum('players.death_count').as('deathCount'),
        sum('players.assist_count').as('assistCount'),
        sum('players.headshot_count').as('headshotCount'),
        sum('one_kill_count').as('oneKillCount'),
        sum('two_kill_count').as('twoKillCount'),
        sum('three_kill_count').as('threeKillCount'),
        sum('four_kill_count').as('fourKillCount'),
        sum('five_kill_count').as('fiveKillCount'),
        sum('bomb_planted_count').as('bombPlantedCount'),
        sum('bomb_defused_count').as('bombDefusedCount'),
        avg('headshot_percentage').as('headshotPercentage'),
        avg('kast').as('kast'),
        sql `SUM(players.kill_count)::NUMERIC / NULLIF(SUM(players.death_count), 0)::NUMERIC`.as('killDeathRatio'),
        avg('hltv_rating').as('hltvRating'),
        avg('hltv_rating_2').as('hltvRating2'),
        avg('average_damage_per_round').as('averageDamagePerRound'),
        avg('average_kill_per_round').as('averageKillsPerRound'),
        avg('average_death_per_round').as('averageDeathsPerRound'),
        sum('hostage_rescued_count').as('hostageRescuedCount'),
        (qb) => {
            let wallbangsQuery = qb
                .selectFrom('kills')
                .select(({ fn }) => {
                return fn.coalesce(fn.count('kills.id'), sql `0`).as('wallbangKillCount');
            })
                .leftJoin('matches', 'matches.checksum', 'kills.match_checksum')
                .where('killer_team_name', '=', name)
                .where('penetrated_objects', '>', 0);
            wallbangsQuery = applyMatchFilters(wallbangsQuery, filters);
            return wallbangsQuery.as('wallbangKillCount');
        },
    ])
        .leftJoin('matches', 'matches.checksum', 'teams.match_checksum')
        .leftJoin('players', (join) => {
        return join
            .onRef('players.match_checksum', '=', 'teams.match_checksum')
            .onRef('players.team_name', '=', 'teams.name');
    })
        .where('teams.name', '=', name)
        .groupBy(['teams.name']);
    query = applyMatchFilters(query, filters);
    return query;
}
export async function fetchTeam(filters) {
    const query = buildQuery(filters);
    const row = await query.executeTakeFirst();
    if (!row) {
        throw new TeamNotFound();
    }
    const [matchCountStats, lastMatches, roundCount, matches, collateralKillCount, clutches, maps, economyStats, sideStats, bombsStats,] = await Promise.all([
        fetchTeamMatchCountStats(filters),
        fetchTeamLastMatches(filters.name),
        fetchTeamRoundCount(filters),
        fetchMatchesTable({
            ...filters,
            teamName: filters.name,
        }),
        fetchTeamCollateralKillCount(filters),
        fetchTeamClutches(filters),
        fetchTeamMapsStats(filters),
        fetchTeamEconomyStats(filters),
        fetchTeamMatchSideStats(filters),
        fetchTeamBombsStats(filters),
    ]);
    const team = {
        ...row,
        ...matchCountStats,
        matches,
        collateralKillCount,
        clutches,
        lastMatches,
        mapsStats: maps,
        roundCount: roundCount.totalCount,
        roundCountAsCt: roundCount.roundCountAsCt,
        roundCountAsT: roundCount.roundCountAsT,
        economyStats,
        sideStats,
        bombsStats,
    };
    return team;
}
//# sourceMappingURL=fetch-team.js.map