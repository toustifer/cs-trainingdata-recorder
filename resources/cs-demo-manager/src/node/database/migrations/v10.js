import { createRoundCommentsTable } from './create-table/create-round-comments-table';
import { createCamerasTable } from './create-table/create-cameras-table';
import { insertDefaultCameras } from '../cameras/insert-default-cameras';
import { createRenownAccountsTable } from './create-table/create-renown-accounts-table';
const v10 = {
    schemaVersion: 10,
    run: async (transaction) => {
        await createRoundCommentsTable(transaction);
        await createCamerasTable(transaction);
        await insertDefaultCameras(transaction);
        await createRenownAccountsTable(transaction);
    },
};
// eslint-disable-next-line no-restricted-syntax
export default v10;
//# sourceMappingURL=v10.js.map