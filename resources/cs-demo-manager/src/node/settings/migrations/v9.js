const v9 = {
    schemaVersion: 9,
    run: (settings) => {
        settings.video.showAssists = true;
        settings.playback.followSymbolicLinks = false;
        settings.playback.customCs2SteamRuntimeScriptLocationEnabled = false;
        settings.playback.cs2SteamRuntimeScriptPath = '';
        settings.ui.enableHardwareAcceleration = true;
        return Promise.resolve(settings);
    },
};
// eslint-disable-next-line no-restricted-syntax
export default v9;
//# sourceMappingURL=v9.js.map