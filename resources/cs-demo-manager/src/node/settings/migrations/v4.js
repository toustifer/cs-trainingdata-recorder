import { defaultSettings } from '../default-settings';
const v4 = {
    schemaVersion: 4,
    run: (settings) => {
        settings.teams = defaultSettings.teams;
        settings.teamProfile = defaultSettings.teamProfile;
        settings.playback.playerVoicesEnabled = defaultSettings.playback.playerVoicesEnabled;
        return Promise.resolve(settings);
    },
};
// eslint-disable-next-line no-restricted-syntax
export default v4;
//# sourceMappingURL=v4.js.map