import { sql } from 'kysely';
import { db } from 'csdm/node/database/database';
export async function fetchPlayerShotsPoints(filters) {
    let query = db
        .selectFrom('shots')
        .select(['x', 'y'])
        .leftJoin('matches', 'checksum', 'match_checksum')
        .where('matches.map_name', '=', filters.mapName)
        .where('player_steam_id', '=', filters.steamId);
    if (filters.startDate !== undefined && filters.endDate !== undefined) {
        query = query.where(sql `matches.date between ${filters.startDate} and ${filters.endDate}`);
    }
    if (filters.sources.length > 0) {
        query = query.where('matches.source', 'in', filters.sources);
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
        query = query.where('max_rounds', 'in', filters.maxRounds);
    }
    if (filters.sides.length > 0) {
        query = query.where('player_side', 'in', filters.sides);
    }
    if (filters.tagIds.length > 0) {
        query = query
            .leftJoin('checksum_tags', 'checksum_tags.checksum', 'matches.checksum')
            .where('checksum_tags.tag_id', 'in', filters.tagIds);
    }
    const points = await query.execute();
    return points;
}
//# sourceMappingURL=fetch-player-shots-points.js.map