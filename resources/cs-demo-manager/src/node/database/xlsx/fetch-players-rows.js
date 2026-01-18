import { sql } from 'kysely';
import { db } from 'csdm/node/database/database';
import { fetchPlayersClutchStats } from '../players/fetch-players-clutch-stats';
import { fetchLastPlayersData } from '../players/fetch-last-players-data';
export async function fetchPlayersRows(filters) {
    const { count, sum, avg } = db.fn;
    let query = db
        .selectFrom('players')
        .select('steam_id as steamId')
        .select(count('match_checksum').as('matchCount'))
        .select(sum('players.kill_count').as('killCount'))
        .select(sum('players.death_count').as('deathCount'))
        .select(sum('players.assist_count').as('assistCount'))
        .select(sum('players.headshot_count').as('headshotCount'))
        .select(sum('players.first_kill_count').as('firstKillCount'))
        .select(sum('players.first_death_count').as('firstDeathCount'))
        .select(sum('damage_health').as('damageHealth'))
        .select(sum('damage_armor').as('damageArmor'))
        .select(sum('utility_damage').as('utilityDamage'))
        .select(sum('one_kill_count').as('oneKillCount'))
        .select(sum('two_kill_count').as('twoKillCount'))
        .select(sum('three_kill_count').as('threeKillCount'))
        .select(sum('four_kill_count').as('fourKillCount'))
        .select(sum('five_kill_count').as('fiveKillCount'))
        .select(sum('bomb_planted_count').as('bombPlantedCount'))
        .select(sum('bomb_defused_count').as('bombDefusedCount'))
        .select(sum('hostage_rescued_count').as('hostageRescuedCount'))
        .select(sum('mvp_count').as('mvpCount'))
        .select(sum('score').as('score'))
        .select(avg('headshot_percentage').as('headshotPercentage'))
        .select(avg('kast').as('kast'))
        .select(avg('hltv_rating').as('hltvRating'))
        .select(avg('hltv_rating_2').as('hltvRating2'))
        .select(avg('average_damage_per_round').as('averageDamagePerRound'))
        .select(avg('average_kill_per_round').as('averageKillsPerRound'))
        .select(avg('average_death_per_round').as('averageDeathsPerRound'))
        .select(sql `ROUND(AVG(utility_damage_per_round)::numeric, 1)`.as('averageUtilityDamagePerRound'))
        .select(sql `ROUND(SUM("players"."kill_count") / GREATEST(SUM("players"."death_count"), 1)::NUMERIC, 1)`.as('killDeathRatio'))
        .leftJoin('matches', 'matches.checksum', 'players.match_checksum')
        .groupBy(['steam_id']);
    const checksums = filters.checksums ?? [];
    if (checksums.length > 0) {
        query = query.select('team_name as teamName').where('matches.checksum', 'in', checksums).groupBy('team_name');
    }
    const filterSteamIds = filters.steamIds ?? [];
    if (filterSteamIds.length > 0) {
        query = query.where('players.steam_id', 'in', filterSteamIds);
    }
    const players = await query.execute();
    const steamIds = players.map((player) => player.steamId);
    const [lastPlayersData, playersClutchStats] = await Promise.all([
        fetchLastPlayersData(steamIds),
        fetchPlayersClutchStats(checksums, steamIds),
    ]);
    const rows = players.map((player) => {
        const lastData = lastPlayersData.find((data) => data.steamId === player.steamId);
        const clutchStats = playersClutchStats.find((stats) => stats.clutcherSteamId === player.steamId);
        if (!lastData) {
            throw new Error(`Last player data not found for steamId: ${player.steamId}`);
        }
        return {
            ...player,
            ...lastData,
            teamName: 'teamName' in player && typeof player.teamName === 'string' ? player.teamName : '',
            gameBanCount: lastData.gameBanCount ?? 0,
            isCommunityBanned: lastData.isCommunityBanned ?? false,
            vacBanCount: lastData.vacBanCount ?? 0,
            lastBanDate: lastData.lastBanDate?.toISOString() ?? null,
            vsOneCount: clutchStats?.vsOneCount ?? 0,
            vsOneWonCount: clutchStats?.vsOneWonCount ?? 0,
            vsOneLostCount: clutchStats?.vsOneLostCount ?? 0,
            vsTwoCount: clutchStats?.vsTwoCount ?? 0,
            vsTwoWonCount: clutchStats?.vsTwoWonCount ?? 0,
            vsTwoLostCount: clutchStats?.vsTwoLostCount ?? 0,
            vsThreeCount: clutchStats?.vsThreeCount ?? 0,
            vsThreeWonCount: clutchStats?.vsThreeWonCount ?? 0,
            vsThreeLostCount: clutchStats?.vsThreeLostCount ?? 0,
            vsFourCount: clutchStats?.vsFourCount ?? 0,
            vsFourWonCount: clutchStats?.vsFourWonCount ?? 0,
            vsFourLostCount: clutchStats?.vsFourLostCount ?? 0,
            vsFiveCount: clutchStats?.vsFiveCount ?? 0,
            vsFiveWonCount: clutchStats?.vsFiveWonCount ?? 0,
            vsFiveLostCount: clutchStats?.vsFiveLostCount ?? 0,
        };
    });
    return rows;
}
//# sourceMappingURL=fetch-players-rows.js.map