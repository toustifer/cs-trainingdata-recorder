import fs from 'fs-extra';
import path from 'node:path';
export async function moveFiles(files, outputFolderPath) {
    await Promise.all(files.map((file) => {
        return fs.move(file, path.join(outputFolderPath, path.basename(file)));
    }));
}
//# sourceMappingURL=move-files.js.map