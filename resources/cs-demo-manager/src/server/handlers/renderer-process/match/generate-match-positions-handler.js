import { handleError } from '../../handle-error';
import { generateMatchPositions } from 'csdm/node/database/matches/generate-match-positions';
import { RendererServerMessageName } from 'csdm/server/renderer-server-message-name';
import { server } from 'csdm/server/server';
export async function generateMatchPositionsHandler({ checksum, demoPath, source }) {
    try {
        await generateMatchPositions({
            demoPath,
            checksum,
            source,
            onInsertionStart: () => {
                server.sendMessageToRendererProcess({
                    name: RendererServerMessageName.InsertingMatchPositions,
                });
            },
        });
    }
    catch (error) {
        handleError(error, 'Error while generating match positions');
    }
}
//# sourceMappingURL=generate-match-positions-handler.js.map