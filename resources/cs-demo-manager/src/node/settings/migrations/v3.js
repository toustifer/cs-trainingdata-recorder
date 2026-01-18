import { defaultSettings } from '../default-settings';
const v3 = {
    schemaVersion: 3,
    run: (settings) => {
        settings.playback.useHlae = defaultSettings.playback.useHlae;
        return Promise.resolve(settings);
    },
};
// eslint-disable-next-line no-restricted-syntax
export default v3;
//# sourceMappingURL=v3.js.map