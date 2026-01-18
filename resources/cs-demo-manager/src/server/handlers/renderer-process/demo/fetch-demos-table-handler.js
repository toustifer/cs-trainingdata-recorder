import { fetchDemosTable } from 'csdm/node/database/demos/fetch-demos-table';
import { server } from 'csdm/server/server';
import { RendererServerMessageName } from 'csdm/server/renderer-server-message-name';
import { handleError } from '../../handle-error';
export async function fetchDemosTableHandler(filter) {
    try {
        const demos = fetchDemosTable(filter, {
            onProgress: (demoLoadedCount, demoToLoadCount) => {
                server.sendMessageToRendererProcess({
                    name: RendererServerMessageName.FetchDemosProgress,
                    payload: {
                        demoLoadedCount,
                        demoToLoadCount,
                    },
                });
            },
        });
        return demos;
    }
    catch (error) {
        handleError(error, 'Error while fetching demos table');
    }
}
//# sourceMappingURL=fetch-demos-table-handler.js.map