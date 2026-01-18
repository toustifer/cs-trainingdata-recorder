import { deleteMap } from 'csdm/node/database/maps/delete-map';
import { handleError } from '../../handle-error';
export async function deleteMapHandler(map) {
    try {
        await deleteMap(map);
    }
    catch (error) {
        handleError(error, 'Error while deleting map');
    }
}
//# sourceMappingURL=delete-map-handler.js.map