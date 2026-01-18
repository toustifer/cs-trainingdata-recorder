import { defaultSettings } from '../default-settings';
const v5 = {
    schemaVersion: 5,
    run: (settings) => {
        settings.players.tagIds = defaultSettings.players.tagIds;
        settings.playback.highlights.includeDamages = defaultSettings.playback.highlights.includeDamages;
        settings.playback.lowlights.includeDamages = defaultSettings.playback.lowlights.includeDamages;
        return Promise.resolve(settings);
    },
};
// eslint-disable-next-line no-restricted-syntax
export default v5;
//# sourceMappingURL=v5.js.map