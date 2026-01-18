import { updateSteamAccountName } from 'csdm/node/database/steam-accounts/update-steam-account-name';
import { handleError } from '../../handle-error';
export async function updateSteamAccountNameHandler({ steamId, name }) {
    try {
        return await updateSteamAccountName(steamId, name);
    }
    catch (error) {
        handleError(error, 'Error while updating steam account name');
    }
}
//# sourceMappingURL=update-steam-account-name-handler.js.map