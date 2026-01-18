import { handleError } from '../../handle-error';
import { addRenownAccount } from 'csdm/node/database/renown-account/add-renown-account';
export async function addRenownAccountHandler(steamId) {
    try {
        const account = await addRenownAccount(steamId);
        return account;
    }
    catch (error) {
        handleError(error, `Error while adding Renown account with steam id ${steamId}`);
    }
}
//# sourceMappingURL=add-renown-account-handler.js.map