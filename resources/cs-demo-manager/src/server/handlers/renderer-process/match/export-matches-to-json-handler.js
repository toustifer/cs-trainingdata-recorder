import { handleError } from '../../handle-error';
import { exportMatchesToJson } from 'csdm/node/json/export-matches-to-json';
export async function exportMatchesToJsonHandler(payload) {
    try {
        await exportMatchesToJson(payload);
    }
    catch (error) {
        handleError(error, 'Error while exporting matches to JSON');
    }
}
//# sourceMappingURL=export-matches-to-json-handler.js.map