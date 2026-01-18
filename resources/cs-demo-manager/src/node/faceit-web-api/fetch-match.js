import { FaceitUnauthorized } from './errors/faceit-unauthorized';
import { FaceitResourceNotFound } from './errors/faceit-resource-not-found';
import { FaceitForbiddenError } from './errors/faceit-forbidden-error';
import { FaceitApiError } from './errors/faceit-api-error';
import { FaceitInvalidRequest } from './errors/faceit-invalid-request';
export async function fetchMatch(matchId, apiKey) {
    const response = await fetch(`https://open.faceit.com/data/v4/matches/${matchId}`, {
        headers: {
            Authorization: `Bearer ${apiKey}`,
            'Content-Type': 'application/json',
        },
    });
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
    const match = await response.json();
    return match;
}
//# sourceMappingURL=fetch-match.js.map