import { db } from '../database';
import { fetch5EPlayAccount } from 'csdm/node/5eplay/fetch-5eplay-player-account-from-domain';
import { fetch5EPlayAccounts } from './fetch-5eplay-accounts';
async function buildAccountFromDTO(domainId, account) {
    const currentAccounts = await fetch5EPlayAccounts();
    return {
        id: account.id,
        domainId,
        nickname: account.username,
        avatarUrl: account.avatarUrl,
        isCurrent: currentAccounts.length === 0,
    };
}
export async function add5EPlayAccount(domainId) {
    const accountDTO = await fetch5EPlayAccount(domainId);
    const account = await buildAccountFromDTO(domainId, accountDTO);
    await db
        .insertInto('5eplay_accounts')
        .values({
        id: account.id,
        domain_id: domainId,
        nickname: account.nickname,
        avatar_url: account.avatarUrl,
        is_current: account.isCurrent,
    })
        .execute();
    return account;
}
//# sourceMappingURL=add-5eplay-account.js.map