import path from 'node:path';
import os from 'node:os';
import fs from 'fs-extra';
import { glob } from 'csdm/node/filesystem/glob';
import { executePsql } from 'csdm/node/database/psql/execute-psql';
import { formatHostnameForUri } from 'csdm/node/database/format-hostname-for-uri';
export function getOutputFolderPath() {
    return path.resolve(os.tmpdir(), 'cs-demo-manager');
}
export function getDemoNameFromPath(demoPath) {
    return path.parse(demoPath).name;
}
export function getCsvFilePath(outputFolderPath, demoName, csvFileSuffix) {
    return path.resolve(outputFolderPath, `${demoName}${csvFileSuffix}`);
}
export async function insertFromCsv({ columns, csvFilePath, databaseSettings, tableName, }) {
    const { database, username, hostname, port, password } = databaseSettings;
    const columnNames = columns.join(',');
    const command = `-c "\\copy ${tableName}(${columnNames}) FROM '${csvFilePath}' ENCODING 'UTF8' CSV DELIMITER ','" "postgresql://${username}:${encodeURIComponent(password)}@${formatHostnameForUri(hostname)}:${port}/${database}"`;
    await executePsql(command);
}
export async function deleteCsvFilesInOutputFolder(outputFolderPath) {
    const files = await glob('*.csv', {
        cwd: outputFolderPath,
        absolute: true,
    });
    await Promise.all(files.map((csvFile) => fs.remove(csvFile)));
}
//# sourceMappingURL=match-insertion.js.map