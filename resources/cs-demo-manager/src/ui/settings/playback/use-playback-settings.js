import { useSettings } from '../use-settings';
import { useUpdateSettings } from '../use-update-settings';
export function usePlaybackSettings() {
    const { playback } = useSettings();
    const updateSettings = useUpdateSettings();
    return {
        updateSettings: (playback) => {
            return updateSettings({
                playback,
            });
        },
        ...playback,
        customCs2LocationEnabled: playback.customCs2LocationEnabled ?? false,
        cs2ExecutablePath: playback.cs2ExecutablePath ?? '',
        customCsgoLocationEnabled: playback.customCsgoLocationEnabled ?? false,
        csgoExecutablePath: playback.csgoExecutablePath ?? '',
    };
}
//# sourceMappingURL=use-playback-settings.js.map