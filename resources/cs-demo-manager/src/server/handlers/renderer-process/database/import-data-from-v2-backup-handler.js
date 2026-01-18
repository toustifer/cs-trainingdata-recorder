import { importDataFromV2Backup, } from 'csdm/node/database/database/import-data-from-v2-backup';
import { handleError } from 'csdm/server/handlers/handle-error';
export async function importDataFromV2BackupHandler(options) {
    try {
        return await importDataFromV2Backup(options);
    }
    catch (error) {
        handleError(error, 'Error while importing data from V2 backup');
    }
}
//# sourceMappingURL=import-data-from-v2-backup-handler.js.map