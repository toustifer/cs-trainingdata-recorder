import { add5EPlayAccount } from 'csdm/node/database/5play-account/add-5eplay-account';
import { handleError } from '../../handle-error';
export async function add5EPlayAccountHandler(domainId) {
    try {
        const account = await add5EPlayAccount(domainId);
        return account;
    }
    catch (error) {
        handleError(error, `Error while adding 5EPlay account with domain id ${domainId}`);
    }
}
//# sourceMappingURL=add-5eplay-account-handler.js.map