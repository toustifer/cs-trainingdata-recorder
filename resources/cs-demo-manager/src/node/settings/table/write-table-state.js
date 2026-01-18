import fs from 'fs-extra';
import { getTableStateFilePath } from './get-table-state-file-path';
export async function writeTableState(tableName, columns) {
    try {
        const settingsFilePath = getTableStateFilePath(tableName);
        await fs.ensureFile(settingsFilePath);
        const json = JSON.stringify(columns, null, 2);
        await fs.writeFile(settingsFilePath, json);
    }
    catch (error) {
        logger.error('Error while writing table settings', tableName);
        logger.error(error);
        throw error;
    }
}
//# sourceMappingURL=write-table-state.js.map