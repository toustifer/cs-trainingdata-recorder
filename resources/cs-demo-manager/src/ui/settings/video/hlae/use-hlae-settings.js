import { useVideoSettings } from 'csdm/ui/settings/video/use-video-settings';
export function useHlaeSettings() {
    const { settings, updateSettings } = useVideoSettings();
    return {
        hlaeSettings: settings.hlae,
        updateHlaeSettings: async (hlaeSettings) => {
            await updateSettings({
                hlae: hlaeSettings,
            });
        },
    };
}
//# sourceMappingURL=use-hlae-settings.js.map