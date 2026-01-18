import { useSettings } from './use-settings';
import { useUpdateSettings } from './use-update-settings';
export function useTeamProfileSettings() {
    const settings = useSettings();
    const updateSettings = useUpdateSettings();
    const { demoSources, games, gameModes, tagIds, maxRounds, startDate, endDate, demoTypes } = settings.teamProfile;
    return {
        updateSettings: async (settings) => {
            await updateSettings({
                teamProfile: settings,
            }, {
                preserveSourceArray: true,
            });
        },
        demoSources,
        games,
        gameModes,
        tagIds,
        maxRounds,
        startDate,
        endDate,
        demoTypes,
    };
}
//# sourceMappingURL=use-team-profile-settings.js.map