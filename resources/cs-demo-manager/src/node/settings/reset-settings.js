import { defaultSettings } from './default-settings';
import { getSettings } from './get-settings';
import { writeSettings } from './write-settings';
export async function resetSettings() {
    const currentSettings = await getSettings();
    const newSettings = {
        ...defaultSettings,
        database: currentSettings.database,
    };
    await writeSettings(newSettings);
}
//# sourceMappingURL=reset-settings.js.map