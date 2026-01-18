import { fetchFaceitAccounts } from 'csdm/node/database/faceit-account/fetch-faceit-accounts';
import { deleteFaceitAccount } from 'csdm/node/database/faceit-account/delete-faceit-account';
import { handleError } from '../../handle-error';
export async function deleteFaceitAccountHandler(accountId) {
    try {
        await deleteFaceitAccount(accountId);
        const accounts = await fetchFaceitAccounts();
        return accounts;
    }
    catch (error) {
        handleError(error, `Error while deleting FACEIT account with id ${accountId}`);
    }
}
//# sourceMappingURL=delete-faceit-account-handler.js.map