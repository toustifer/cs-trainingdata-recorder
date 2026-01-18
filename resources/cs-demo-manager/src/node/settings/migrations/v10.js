const v10 = {
    schemaVersion: 10,
    run: (settings) => {
        settings.video.recordAudio = true;
        settings.download.downloadRenownDemosAtStartup = true;
        settings.download.downloadRenownDemosInBackground = true;
        return Promise.resolve(settings);
    },
};
// eslint-disable-next-line no-restricted-syntax
export default v10;
//# sourceMappingURL=v10.js.map