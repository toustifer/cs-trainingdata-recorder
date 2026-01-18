const v8 = {
    schemaVersion: 8,
    run: (settings) => {
        if (!settings.matches.demoSources) {
            settings.matches.demoSources = [];
        }
        return Promise.resolve(settings);
    },
};
// eslint-disable-next-line no-restricted-syntax
export default v8;
//# sourceMappingURL=v8.js.map