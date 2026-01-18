import { downloadDemoQueue } from 'csdm/server/download-queue';
import { handleError } from '../../handle-error';
export async function addDownloadsHandler(downloads) {
    try {
        await downloadDemoQueue.addDownloads(downloads);
    }
    catch (error) {
        handleError(error, 'Error while adding downloads');
    }
}
//# sourceMappingURL=add-downloads-handler.js.map