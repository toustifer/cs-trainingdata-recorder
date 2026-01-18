import { assertValidRenownResponse } from './assert-valid-renown-response';
export async function fetchRenownAccount(steamId) {
    const response = await fetch(`https://api.renown.gg/v1/player/${steamId}`);
    assertValidRenownResponse(response);
    const account = await response.json();
    return account;
}
//# sourceMappingURL=fetch-renown-account-from-steamid.js.map