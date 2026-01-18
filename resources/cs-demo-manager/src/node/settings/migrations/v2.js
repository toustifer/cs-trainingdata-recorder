import { defaultSettings } from '../default-settings';
const v2 = {
    schemaVersion: 2,
    run: (settings) => {
        settings.video.ffmpegSettings.videoContainer = defaultSettings.video.ffmpegSettings.videoContainer;
        settings.playback.round = defaultSettings.playback.round;
        return Promise.resolve(settings);
    },
};
// eslint-disable-next-line no-restricted-syntax
export default v2;
//# sourceMappingURL=v2.js.map