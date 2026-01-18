import { getSettings } from 'csdm/node/settings/get-settings';
import { FiveEPlayResourceNotFound } from './errors/5eplay-resource-not-found';
import { fetch5EPlayMatch } from './fetch-5eplay-match';
import { Game } from 'csdm/common/types/counter-strike';
async function fetchLastMatchIdsForGame(accountId, game, limit) {
    const type = game === Game.CSGO ? 1 : 0;
    const response = await fetch(`https://gate.5eplay.com/crane/http/api/data/match/list?uuid=${accountId}&limit=${limit}&cs_type=${type}`);
    const matches = await response.json();
    if (matches.data === null) {
        throw new FiveEPlayResourceNotFound();
    }
    return matches.data.map((matchDTO) => matchDTO.match_id);
}
export async function fetchLast5EPlayMatches(accountId) {
    const matches = [];
    const maxMatchCount = 20;
    const matchIds = await fetchLastMatchIdsForGame(accountId, Game.CS2, maxMatchCount);
    // We didn't find enough CS2 matches, find CS:GO matches
    if (matchIds.length < maxMatchCount) {
        const limit = maxMatchCount - matchIds.length;
        const csgoMatchIds = await fetchLastMatchIdsForGame(accountId, Game.CSGO, limit);
        if (csgoMatchIds.length > 0) {
            matchIds.push(...csgoMatchIds);
        }
    }
    if (matchIds.length === 0) {
        return matches;
    }
    const settings = await getSettings();
    const downloadFolderPath = settings.download.folderPath;
    for (const matchId of matchIds) {
        try {
            const match = await fetch5EPlayMatch(matchId, downloadFolderPath);
            matches.push(match);
        }
        catch (error) {
            if (!(error instanceof FiveEPlayResourceNotFound)) {
                throw error;
            }
        }
    }
    return matches;
}
//# sourceMappingURL=fetch-last-5eplay-matches.js.map