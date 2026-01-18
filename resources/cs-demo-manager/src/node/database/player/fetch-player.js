import { sql } from 'kysely';
import { PlayerNotFound } from '../../errors/player-not-found';
import { fetchPlayerMatchCountStats } from './fetch-player-match-count-stats';
import { db } from 'csdm/node/database/database';
import { fetchPlayerRoundCountStats } from './fetch-player-round-count-stats';
import { fetchLastPlayerData } from './fetch-last-player-data';
import { applyMatchFilters } from '../match/apply-match-filters';
import { fetchPlayerCollateralKillCount } from './fetch-player-collateral-kill-count';
import { fetchPlayerUtilityStats } from './fetch-player-utility-stats';
import { fetchPlayerOpeningDuelsStats } from './fetch-player-opening-duels-stats';
import { EconomyBan } from 'csdm/node/steam-web-api/steam-constants';
async function fetchPlayerRow(steamId, filters) {
    const { count, avg, sum } = db.fn;
    let query = db
        .selectFrom('players')
        .select([
        'players.steam_id as steamId',
        count('players.match_checksum').as('matchCount'),
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
        sum('mvp_count').as('mvpCount'),
        sum('first_kill_count').as('firstKillCount'),
        sum('first_death_count').as('firstDeathCount'),
        sum('first_trade_kill_count').as('firstTradeKillCount'),
        sum('first_trade_death_count').as('firstTradeDeathCount'),
        sum('trade_kill_count').as('tradeKillCount'),
        sum('trade_death_count').as('tradeDeathCount'),
        sum('damage_health').as('damageHealth'),
        sum('damage_armor').as('damageArmor'),
        sum('utility_damage').as('utilityDamage'),
        avg('headshot_percentage').as('headshotPercentage'),
        sql `ROUND(AVG(utility_damage_per_round)::numeric, 1)`.as('averageUtilityDamagePerRound'),
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
                .select(count('kills.id').as('wallbangKillCount'))
                .leftJoin('matches', 'matches.checksum', 'kills.match_checksum')
                .where('killer_steam_id', '=', steamId)
                .where('penetrated_objects', '>', 0);
            if (filters) {
                wallbangsQuery = applyMatchFilters(wallbangsQuery, filters);
            }
            return wallbangsQuery.as('wallbangKillCount');
        },
    ])
        .leftJoin('matches', 'matches.checksum', 'players.match_checksum')
        .leftJoin('steam_accounts', 'steam_accounts.steam_id', 'players.steam_id')
        .select([
        'vac_ban_count as vacBanCount',
        'game_ban_count as gameBanCount',
        'last_ban_date as lastBanDate',
        'economy_ban as economyBan',
        'has_private_profile as hasPrivateProfile',
        'is_community_banned as isCommunityBanned',
    ])
        .where('players.steam_id', '=', steamId)
        .groupBy([
        'players.steam_id',
        'vacBanCount',
        'gameBanCount',
        'lastBanDate',
        'economyBan',
        'hasPrivateProfile',
        'isCommunityBanned',
    ]);
    if (filters) {
        query = applyMatchFilters(query, filters);
    }
    const row = await query.executeTakeFirst();
    if (!row) {
        throw new PlayerNotFound();
    }
    return row;
}
export async function fetchPlayer(steamId, filters) {
    const [playerRow, lastPlayerData, matchCountStats, roundCount, collateralKillCount, utilitiesStats, openingDuelsStats,] = await Promise.all([
        fetchPlayerRow(steamId, filters),
        fetchLastPlayerData(steamId, filters),
        fetchPlayerMatchCountStats(steamId, filters),
        fetchPlayerRoundCountStats(steamId, filters),
        fetchPlayerCollateralKillCount(steamId, filters),
        fetchPlayerUtilityStats(steamId, filters),
        fetchPlayerOpeningDuelsStats(steamId, filters),
    ]);
    const player = {
        ...playerRow,
        ...lastPlayerData,
        ...matchCountStats,
        ...roundCount,
        ...utilitiesStats,
        roundCount: roundCount.totalCount,
        collateralKillCount,
        wallbangKillCount: playerRow.wallbangKillCount ?? 0,
        vacBanCount: playerRow.vacBanCount ?? 0,
        gameBanCount: playerRow.gameBanCount ?? 0,
        economyBan: playerRow.economyBan ?? EconomyBan.None,
        hasPrivateProfile: playerRow.hasPrivateProfile ?? false,
        isCommunityBanned: playerRow.isCommunityBanned ?? false,
        lastBanDate: playerRow.lastBanDate?.toISOString() ?? null,
        openingDuelsStats: openingDuelsStats.all,
    };
    return player;
}
//# sourceMappingURL=fetch-player.js.map