import { insertDefaultMaps } from '../maps/insert-default-maps';
const v8 = {
    schemaVersion: 8,
    run: async (transaction) => {
        // Insert maps from the May 9, 2025 update
        await insertDefaultMaps(transaction);
    },
};
// eslint-disable-next-line no-restricted-syntax
export default v8;
//# sourceMappingURL=v8.js.map