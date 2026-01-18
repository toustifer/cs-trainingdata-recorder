import { db } from '../database';
export async function fetchMatchPlayersSlots(checksum) {
    const rows = await db
        .selectFrom('matches')
        .innerJoin('players', (qb) => {
        return qb.onRef('players.match_checksum', '=', 'matches.checksum');
    })
        .innerJoin('teams', (qb) => {
        return qb
            .onRef('teams.match_checksum', '=', 'players.match_checksum')
            .onRef('teams.name', '=', 'players.team_name');
    })
        .select(['players.steam_id', 'players.index as slot', 'teams.current_side as side'])
        .where('matches.checksum', '=', checksum)
        .execute();
    const players = rows.map((row) => {
        return {
            steamId: row.steam_id,
            side: row.side,
            slot: row.slot,
            userId: row.slot - 1, // The player slot is the user id + 1 in demos.
        };
    });
    return players;
}
//# sourceMappingURL=fetch-match-players-slots.js.map