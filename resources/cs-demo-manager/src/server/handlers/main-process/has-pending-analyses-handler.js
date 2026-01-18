import { analysesListener } from 'csdm/server/analyses-listener';
export async function hasPendingAnalysesHandler() {
    return Promise.resolve(analysesListener.hasAnalysesInProgress());
}
//# sourceMappingURL=has-pending-analyses-handler.js.map