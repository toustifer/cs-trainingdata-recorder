import { updateSettingsAndNotifyRendererProcess } from 'csdm/server/update-settings-and-notify-renderer-process';
import { getSettings } from './get-settings';
export async function removeTagIdFromSettings(tagId) {
    const settings = await getSettings();
    let shouldUpdateSettings = false;
    function cleanupArray(tagIds) {
        if (Array.isArray(tagIds) && tagIds.includes(tagId)) {
            shouldUpdateSettings = true;
            return tagIds.filter((id) => id !== tagId);
        }
        return tagIds;
    }
    settings.demos.tagIds = cleanupArray(settings.demos.tagIds);
    settings.matches.tagIds = cleanupArray(settings.matches.tagIds);
    settings.playerProfile.tagIds = cleanupArray(settings.playerProfile.tagIds);
    if (shouldUpdateSettings) {
        await updateSettingsAndNotifyRendererProcess(settings, { preserveSourceArray: true });
    }
}
//# sourceMappingURL=remove-tag-id-from-settings.js.map