import { db } from '../database';
export async function fetchPlayersPerMatch(checksums) {
    const rows = await db
        .selectFrom('players')
        .select(['steam_id as steamId', 'name', 'match_checksum as checksum'])
        .where((eb) => eb('players.match_checksum', '=', eb.fn.any(eb.val(checksums))))
        .execute();
    const playersPerMatch = {};
    for (const row of rows) {
        const { checksum, steamId, name } = row;
        if (!playersPerMatch[checksum]) {
            playersPerMatch[checksum] = [];
        }
        playersPerMatch[checksum].push({
            steamId,
            name,
        });
    }
    return playersPerMatch;
}
//# sourceMappingURL=fetch-players-per-match.js.map