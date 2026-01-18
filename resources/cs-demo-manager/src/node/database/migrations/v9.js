import { insertDefaultMaps } from '../maps/insert-default-maps';
const v9 = {
    schemaVersion: 9,
    run: async (transaction) => {
        // Insert maps from the 02/10/2025 update
        await insertDefaultMaps(transaction);
    },
};
// eslint-disable-next-line no-restricted-syntax
export default v9;
//# sourceMappingURL=v9.js.map