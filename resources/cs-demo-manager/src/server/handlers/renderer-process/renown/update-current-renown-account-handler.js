import { handleError } from '../../handle-error';
import { updateCurrentRenownAccount } from 'csdm/node/database/renown-account/update-current-renown-account';
import { fetchRenownAccounts } from 'csdm/node/database/renown-account/fetch-renown-accounts';
export async function updateCurrentRenownAccountHandler(steamId) {
    try {
        await updateCurrentRenownAccount(steamId);
        const accounts = await fetchRenownAccounts();
        return accounts;
    }
    catch (error) {
        handleError(error, `Error while updating current Renown account with Steam ID ${steamId}`);
    }
}
//# sourceMappingURL=update-current-renown-account-handler.js.map