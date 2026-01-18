import fs from 'node:fs/promises';
import { InvalidBackupFile } from './errors/invalid-backup-file';
import { getSettings } from 'csdm/node/settings/get-settings';
import { findDemosInFolders } from 'csdm/node/demo/find-demos-in-folders';
import { getDemoHeader } from 'csdm/node/demo/get-demo-header';
import { getDemoChecksumFromFileStats } from 'csdm/node/demo/get-demo-checksum-from-file-stats';
import { insertOrUpdateComment } from 'csdm/node/database/comments/insert-or-update-comment';
import { updateChecksumsTags } from 'csdm/node/database/tags/update-checksums-tags';
import { fetchTags } from 'csdm/node/database/tags/fetch-tags';
import { insertDefaultTags } from 'csdm/node/database/tags/insert-default-tags';
import { TagNotFound } from 'csdm/node/database/tags/errors/tag-not-found';
import { db } from '../database';
function getDemoIdV2(header, stats) {
    const seconds = Math.trunc(new Date(stats.mtime.getTime() - stats.mtime.getTimezoneOffset() * 60000).getTime() / 1000);
    return `${header.mapName.replace('/', '')}_${header.signonLength}${header.playbackTicks}${header.playbackFrames}${seconds}${stats.size}`;
}
async function getDemosToImportFromBackupFile(options) {
    try {
        const content = await fs.readFile(options.backupFilePath, 'utf-8');
        const data = JSON.parse(content);
        if (!Array.isArray(data.Demos)) {
            throw new InvalidBackupFile();
        }
        const demos = [];
        for (const demo of data.Demos) {
            for (const key of ['Comment', 'Id', 'status']) {
                if (typeof demo[key] !== 'string') {
                    throw new InvalidBackupFile();
                }
            }
            if ((options.importComments && demo.Comment !== '') || (options.importStatuses && demo.status !== 'None')) {
                demos.push(demo);
            }
        }
        return demos;
    }
    catch (error) {
        if (error instanceof SyntaxError) {
            throw new InvalidBackupFile();
        }
        throw error;
    }
}
export async function importDataFromV2Backup(options) {
    const result = {
        demoToImportCount: 0,
        demoFoundCount: 0,
        updatedDemoPaths: [],
    };
    const demosToImport = await getDemosToImportFromBackupFile(options);
    if (demosToImport.length === 0) {
        return result;
    }
    result.demoToImportCount = demosToImport.length;
    const { folders } = await getSettings();
    const demoPaths = await findDemosInFolders(folders);
    if (demoPaths.length === 0) {
        return result;
    }
    result.demoFoundCount = demoPaths.length;
    await insertDefaultTags(db);
    const tags = await fetchTags();
    const toWatchTag = tags.find((tag) => tag.name === 'To watch');
    if (!toWatchTag) {
        throw new TagNotFound();
    }
    const watchedTag = tags.find((tag) => tag.name === 'Watched');
    if (!watchedTag) {
        throw new TagNotFound();
    }
    for (const demoPath of demoPaths) {
        let header;
        try {
            header = await getDemoHeader(demoPath);
        }
        catch (error) {
            // Ignore invalid header
        }
        if (header?.filestamp !== 'HL2DEMO') {
            continue;
        }
        const stats = await fs.stat(demoPath);
        const idV2 = getDemoIdV2(header, stats);
        const demo = demosToImport.find((demo) => demo.Id === idV2);
        if (!demo) {
            continue;
        }
        const checksum = getDemoChecksumFromFileStats(header, stats);
        const shouldUpdateComment = options.importComments && demo.Comment !== '';
        if (shouldUpdateComment) {
            await insertOrUpdateComment(checksum, demo.Comment);
        }
        const shouldUpdateStatus = options.importStatuses && demo.status !== 'None';
        if (shouldUpdateStatus) {
            const tagId = demo.status === 'watched' ? watchedTag.id : toWatchTag.id;
            await updateChecksumsTags([checksum], [tagId]);
        }
        if (shouldUpdateComment || shouldUpdateStatus) {
            result.updatedDemoPaths.push(demoPath);
        }
    }
    return result;
}
//# sourceMappingURL=import-data-from-v2-backup.js.map