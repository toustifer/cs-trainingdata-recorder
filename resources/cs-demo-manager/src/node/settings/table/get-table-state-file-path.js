import path from 'node:path';
import { getAppFolderPath } from 'csdm/node/filesystem/get-app-folder-path';
export function getTableStateFilePath(tableName) {
    return path.resolve(getAppFolderPath(), 'tables', `${tableName}.json`);
}
//# sourceMappingURL=get-table-state-file-path.js.map