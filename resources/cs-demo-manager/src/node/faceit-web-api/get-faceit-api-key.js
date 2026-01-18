import { getSettings } from 'csdm/node/settings/get-settings';
export async function getFaceitApiKey() {
    const { faceitApiKey } = await getSettings();
    if (faceitApiKey !== '') {
        return faceitApiKey;
    }
    return process.env.FACEIT_API_KEY;
}
//# sourceMappingURL=get-faceit-api-key.js.map