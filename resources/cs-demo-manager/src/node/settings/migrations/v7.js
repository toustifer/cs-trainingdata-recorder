const v7 = {
    schemaVersion: 7,
    run: (settings) => {
        // Rename sources to demoSources
        // @ts-expect-error Old settings schema
        settings.matches.demoSources = settings.matches.sources;
        // @ts-expect-error Old settings schema
        delete settings.matches.sources;
        return Promise.resolve(settings);
    },
};
// eslint-disable-next-line no-restricted-syntax
export default v7;
//# sourceMappingURL=v7.js.map