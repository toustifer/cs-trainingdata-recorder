import { FiveEPlayApiError } from './errors/5eplay-api-error';
import { FiveEPlayInvalidRequest } from './errors/5eplay-invalid-request';
import { FiveEPlayResourceNotFound } from './errors/5eplay-resource-not-found';
async function fetchPlayerIdFromDomain(domain) {
    const response = await fetch('https://gate.5eplay.com/userinterface/http/v1/userinterface/idTransfer', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trans: { domain } }),
    });
    const data = await response.json();
    if (response.status === 400) {
        throw new FiveEPlayInvalidRequest();
    }
    if (response.status !== 200) {
        throw new FiveEPlayApiError(response.status);
    }
    const id = data.data.uuid;
    // 5EPlay don't rely on a 404 status code to indicate a non-existing player but rather an empty string in the payload
    if (id === '') {
        throw new FiveEPlayResourceNotFound();
    }
    return data.data.uuid;
}
async function fetchPlayerInformation(id) {
    const response = await fetch(`https://gate.5eplay.com/userinterface/pt/v1/userinterface/header/${id}`);
    if (response.status === 500) {
        // The API returns a 500 status code when the player doesn't exist ¯\_(ツ)_/¯
        try {
            const data = await response.json();
            if ('reason' in data && data.reason === 'USER_NOT_FOUND') {
                throw new FiveEPlayResourceNotFound();
            }
        }
        catch (error) {
            throw new FiveEPlayApiError(response.status);
        }
        throw new FiveEPlayApiError(response.status);
    }
    if (response.status !== 200) {
        throw new FiveEPlayApiError(response.status);
    }
    const data = await response.json();
    const userData = data.data.header.user_data;
    return {
        username: userData.username,
        avatarUrl: `https://oss-arena.5eplay.com/${userData.avatar_url}`,
    };
}
export async function fetch5EPlayAccount(domainId) {
    const playerId = await fetchPlayerIdFromDomain(domainId);
    const { username, avatarUrl } = await fetchPlayerInformation(playerId);
    return { id: playerId, username, avatarUrl };
}
//# sourceMappingURL=fetch-5eplay-player-account-from-domain.js.map