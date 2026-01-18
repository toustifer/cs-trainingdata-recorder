import { useSettings } from '../use-settings';
import { useUpdateSettings } from '../use-update-settings';
export function useVideoSettings() {
    const settings = useSettings();
    const updateSettings = useUpdateSettings();
    return {
        settings: settings.video,
        updateSettings: async (settings) => {
            await updateSettings({
                video: settings,
            });
        },
    };
}
//# sourceMappingURL=use-video-settings.js.map