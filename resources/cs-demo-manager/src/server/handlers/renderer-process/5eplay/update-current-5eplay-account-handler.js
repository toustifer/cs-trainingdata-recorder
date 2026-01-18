import { handleError } from '../../handle-error';
import { updateCurrent5EPlayAccount } from 'csdm/node/database/5play-account/update-current-5eplay-account';
import { fetch5EPlayAccounts } from 'csdm/node/database/5play-account/fetch-5eplay-accounts';
export async function updateCurrent5EPlayAccountHandler(accountId) {
    try {
        await updateCurrent5EPlayAccount(accountId);
        const accounts = await fetch5EPlayAccounts();
        return accounts;
    }
    catch (error) {
        handleError(error, `Error while updating current 5EPlay account with id ${accountId}`);
    }
}
//# sourceMappingURL=update-current-5eplay-account-handler.js.map