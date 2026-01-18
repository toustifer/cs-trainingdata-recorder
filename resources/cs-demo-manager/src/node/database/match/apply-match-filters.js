import { sql } from 'kysely';
import { RankingFilter } from 'csdm/common/types/ranking-filter';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function applyMatchFilters(query, filters) {
    if (filters.startDate && filters.endDate) {
        query = query.where(sql `matches.date between ${filters.startDate} and ${filters.endDate}`);
    }
    if (filters.ranking && filters.ranking !== RankingFilter.All) {
        query = query.where('matches.is_ranked', '=', filters.ranking === RankingFilter.Ranked);
    }
    if (filters.demoSources.length > 0) {
        query = query.where('matches.source', 'in', filters.demoSources);
    }
    if (filters.games.length > 0) {
        query = query.where('matches.game', 'in', filters.games);
    }
    if (filters.demoTypes.length > 0) {
        query = query.where('matches.type', 'in', filters.demoTypes);
    }
    if (filters.gameModes.length > 0) {
        query = query.where('matches.game_mode_str', 'in', filters.gameModes);
    }
    if (filters.maxRounds.length > 0) {
        query = query.where('matches.max_rounds', 'in', filters.maxRounds);
    }
    if (filters.tagIds.length > 0) {
        query = query
            .leftJoin('checksum_tags', 'checksum_tags.checksum', 'matches.checksum')
            .where('checksum_tags.tag_id', 'in', filters.tagIds);
    }
    return query;
}
//# sourceMappingURL=apply-match-filters.js.map