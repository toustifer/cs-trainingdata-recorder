import { db } from '../database';
import { fetchRenownAccount } from 'csdm/node/renown/fetch-renown-account-from-steamid';
import { fetchRenownAccounts } from './fetch-renown-accounts';
async function buildAccountFromDTO(account) {
    const currentAccounts = await fetchRenownAccounts();
    return {
        id: account.steam_id,
        nickname: account.nickname,
        avatarUrl: account.steam_avatar,
        isCurrent: currentAccounts.length === 0,
    };
}
export async function addRenownAccount(steamId) {
    const accountDTO = await fetchRenownAccount(steamId);
    const account = await buildAccountFromDTO(accountDTO);
    await db
        .insertInto('renown_accounts')
        .values({
        steam_id: account.id,
        nickname: account.nickname,
        avatar_url: account.avatarUrl,
        is_current: account.isCurrent,
    })
        .execute();
    return account;
}
//# sourceMappingURL=add-renown-account.js.map