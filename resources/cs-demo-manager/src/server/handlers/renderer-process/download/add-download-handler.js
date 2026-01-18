import { downloadDemoQueue } from 'csdm/server/download-queue';
import { handleError } from '../../handle-error';
export async function addDownloadHandler(download) {
    try {
        await downloadDemoQueue.addDownload(download);
    }
    catch (error) {
        handleError(error, 'Error while adding download');
    }
}
//# sourceMappingURL=add-download-handler.js.map