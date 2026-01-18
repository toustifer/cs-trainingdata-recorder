import { sql } from 'kysely';
import { CompetitiveRank } from 'csdm/common/types/counter-strike';
import { db } from 'csdm/node/database/database';
export async function fetchPlayerCompetitiveRankHistory(steamId, { startDate, endDate }) {
    let query = db
        .selectFrom('players')
        .select(['rank as rank', 'old_rank as oldRank', 'wins_count as winCount'])
        .innerJoin('matches', 'matches.checksum', 'players.match_checksum')
        .select('matches.date')
        .where('steam_id', '=', steamId)
        .where('rank', '>', CompetitiveRank.Unknown)
        .where('rank', '<=', CompetitiveRank.GlobalElite)
        .orderBy('date', 'asc');
    if (startDate && endDate) {
        query = query.where(sql `matches.date between ${startDate} and ${endDate}`);
    }
    const rows = await query.execute();
    const rankHistories = [];
    let lastKnowRank = -1;
    for (const row of rows) {
        const rank = row.rank;
        if (lastKnowRank !== rank) {
            rankHistories.push({
                matchDate: row.date.toISOString(),
                rank,
                winCount: row.winCount,
                oldRank: lastKnowRank === -1 ? row.oldRank : lastKnowRank,
            });
        }
        lastKnowRank = rank;
    }
    return rankHistories;
}
//# sourceMappingURL=fetch-player-competitive-rank-history.js.map