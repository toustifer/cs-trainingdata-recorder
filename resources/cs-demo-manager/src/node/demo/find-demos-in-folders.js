import { glob } from 'csdm/node/filesystem/glob';
export async function findDemosInFolders(folders) {
    const demoPaths = [];
    for (const folder of folders) {
        const pattern = folder.includeSubFolders ? '**/*.dem' : '*.dem';
        const files = await glob(pattern, {
            cwd: folder.path,
            absolute: true,
        });
        demoPaths.push(...files);
    }
    return demoPaths;
}
//# sourceMappingURL=find-demos-in-folders.js.map