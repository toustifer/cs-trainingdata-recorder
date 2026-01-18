import { FaceitApiError } from './errors/faceit-api-error';
import { FaceitForbiddenError } from './errors/faceit-forbidden-error';
import { FaceitUnauthorized } from './errors/faceit-unauthorized';
import { FaceitResourceNotFound } from './errors/faceit-resource-not-found';
import { FaceitInvalidRequest } from './errors/faceit-invalid-request';
async function fetchPlayerLastMatchesForGame(playerId, apiKey, game, limit) {
    const response = await fetch(`https://open.faceit.com/data/v4/players/${playerId}/history?limit=${limit}&game=${game}`, {
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
    });
    const { items: matches } = await response.json();
    if (response.status === 401) {
        throw new FaceitUnauthorized();
    }
    if (response.status === 404) {
        throw new FaceitResourceNotFound();
    }
    if (response.status === 403) {
        throw new FaceitForbiddenError();
    }
    if (response.status === 400) {
        throw new FaceitInvalidRequest();
    }
    if (response.status !== 200) {
        throw new FaceitApiError(response.status);
    }
    return matches;
}
export async function fetchPlayerLastMatches(playerId, apiKey) {
    const maxMatchCount = 20;
    const matches = [];
    const cs2Matches = await fetchPlayerLastMatchesForGame(playerId, apiKey, 'cs2', maxMatchCount);
    if (cs2Matches.length > 0) {
        matches.push(...cs2Matches);
    }
    // We didn't find enough CS2 matches, find CS:GO matches
    if (matches.length < maxMatchCount) {
        const limit = maxMatchCount - matches.length;
        const csgoMatches = await fetchPlayerLastMatchesForGame(playerId, apiKey, 'csgo', limit);
        if (csgoMatches.length > 0) {
            matches.push(...csgoMatches);
        }
    }
    return matches;
}
//# sourceMappingURL=fetch-player-last-matches.js.map