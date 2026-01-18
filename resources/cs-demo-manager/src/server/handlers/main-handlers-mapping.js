import { MainClientMessageName } from 'csdm/server/main-client-message-name';
import { hasPendingAnalysesHandler } from './main-process/has-pending-analyses-handler';
import { startMinimizedModeHandler } from './main-process/start-minimized-mode-handler';
import { startCounterStrikeHandler } from './main-process/start-counter-strike-handler';
// Mapping between message names and server handlers sent from the Electron main process to the WebSocket server.
export const mainHandlers = {
    [MainClientMessageName.HasPendingAnalyses]: hasPendingAnalysesHandler,
    [MainClientMessageName.StartMinimizedMode]: startMinimizedModeHandler,
    [MainClientMessageName.StartCounterStrike]: startCounterStrikeHandler,
};
//# sourceMappingURL=main-handlers-mapping.js.map