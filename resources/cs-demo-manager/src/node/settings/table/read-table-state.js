import fs from 'fs-extra';
import { getTableStateFilePath } from './get-table-state-file-path';
export async function readTableState(tableName) {
    const settingsFilePath = getTableStateFilePath(tableName);
    const settingsFileExists = await fs.pathExists(settingsFilePath);
    if (!settingsFileExists) {
        return [];
    }
    try {
        const json = await fs.readFile(settingsFilePath, 'utf8');
        const columns = JSON.parse(json);
        return columns;
    }
    catch (error) {
        logger.error(`Error reading table state file: ${settingsFilePath}`);
        logger.error(error);
        return [];
    }
}
//# sourceMappingURL=read-table-state.js.map