import { FaceitApiError } from './errors/faceit-api-error';
import { FaceitForbiddenError } from './errors/faceit-forbidden-error';
import { FaceitUnauthorized } from './errors/faceit-unauthorized';
import { getFaceitApiKey } from './get-faceit-api-key';
import { FaceitResourceNotFound } from './errors/faceit-resource-not-found';
import { FaceitInvalidRequest } from './errors/faceit-invalid-request';
export async function fetchFaceitAccount(nickname) {
    const apiKey = await getFaceitApiKey();
    const response = await fetch(`https://open.faceit.com/data/v4/players?nickname=${nickname}`, {
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
    const account = await response.json();
    return account;
}
//# sourceMappingURL=fetch-faceit-account.js.map