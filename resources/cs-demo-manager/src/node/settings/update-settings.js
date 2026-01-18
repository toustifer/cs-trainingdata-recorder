import deepMerge from 'deepmerge';
import { getSettings } from './get-settings';
import { writeSettings } from './write-settings';
function preserveSourceArray(destinationArray, sourceArray) {
    return sourceArray;
}
export async function updateSettings(partialSettings, options) {
    const mergeOptions = {};
    if (options?.preserveSourceArray === true) {
        mergeOptions.arrayMerge = preserveSourceArray;
    }
    const currentSettings = await getSettings();
    const newSettings = deepMerge(currentSettings, partialSettings, mergeOptions);
    await writeSettings(newSettings);
    return newSettings;
}
//# sourceMappingURL=update-settings.js.map