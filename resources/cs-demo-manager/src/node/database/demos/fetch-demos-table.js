import { getDemoFromFilePath } from 'csdm/node/demo/get-demo-from-file-path';
import { fetchDemosByFilePaths } from 'csdm/node/database/demos/fetch-demos-by-file-paths';
import { insertDemos } from 'csdm/node/database/demos/insert-demos';
import { getDemosFilePathsToLoad } from 'csdm/node/demo/get-demos-file-paths-to-load';
import { fetchChecksumTags } from 'csdm/node/database/tags/fetch-checksum-tags';
import { fetchComments } from 'csdm/node/database/comments/fetch-comments';
import { getErrorCodeFromError } from 'csdm/server/get-error-code-from-error';
function applyFilters(filter, demos) {
    const startDate = filter.startDate !== undefined ? new Date(filter.startDate) : undefined;
    const endDate = filter.endDate !== undefined ? new Date(filter.endDate) : undefined;
    const filteredDemos = demos.filter((demo) => {
        let dateMatch = true;
        let tagsMatch = true;
        let sourceMatch = true;
        let gameMatch = true;
        if (startDate !== undefined && endDate !== undefined) {
            const date = new Date(demo.date);
            if (date < startDate || date > endDate) {
                dateMatch = false;
            }
        }
        if (filter.tagIds.length > 0) {
            tagsMatch = filter.tagIds.some((tagId) => {
                return demo.tagIds.includes(tagId);
            });
        }
        if (filter.sources.length > 0) {
            sourceMatch = filter.sources.includes(demo.source);
        }
        if (filter.types.length > 0) {
            sourceMatch = filter.types.includes(demo.type);
        }
        if (filter.games.length > 0) {
            gameMatch = filter.games.includes(demo.game);
        }
        return dateMatch && tagsMatch && sourceMatch && gameMatch;
    });
    return filteredDemos;
}
export async function fetchDemosTable(filter, { onProgress }) {
    try {
        const filePaths = await getDemosFilePathsToLoad();
        const demosInDatabase = await fetchDemosByFilePaths(filePaths);
        const tags = await fetchChecksumTags();
        const comments = await fetchComments();
        onProgress(0, filePaths.length);
        const demosToInsert = [];
        const demos = [];
        for (let i = 0; i < filePaths.length; i++) {
            const filePath = filePaths[i];
            onProgress(i + 1, filePaths.length);
            const isAlreadyLoaded = demos.some((demo) => demo.filePath === filePath);
            if (isAlreadyLoaded) {
                continue;
            }
            try {
                const demoInDatabase = demosInDatabase.find((demo) => demo.filePath === filePath);
                if (demoInDatabase !== undefined) {
                    demos.push(demoInDatabase);
                    continue;
                }
                const demo = await getDemoFromFilePath(filePath);
                demo.tagIds = tags
                    .filter((row) => {
                    return row.checksum === demo.checksum;
                })
                    .map((row) => String(row.tag_id));
                const demoComment = comments.find((row) => {
                    return row.checksum === demo.checksum;
                });
                if (demoComment !== undefined) {
                    demo.comment = demoComment.comment;
                }
                demosToInsert.push(demo);
                demos.push(demo);
            }
            catch (error) {
                logger.error(`Error while loading demo ${filePath}`);
                logger.error(error);
            }
        }
        if (demosToInsert.length > 0) {
            await insertDemos(demosToInsert);
        }
        const filteredDemos = applyFilters(filter, demos);
        return filteredDemos;
    }
    catch (error) {
        logger.error('Error while loading demos');
        logger.error(error);
        const errorCode = getErrorCodeFromError(error);
        throw errorCode;
    }
}
//# sourceMappingURL=fetch-demos-table.js.map