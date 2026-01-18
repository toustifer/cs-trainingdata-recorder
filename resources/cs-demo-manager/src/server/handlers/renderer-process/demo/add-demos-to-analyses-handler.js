import { analysesListener } from 'csdm/server/analyses-listener';
export async function addDemosToAnalysesHandler(demos) {
    await analysesListener.addDemosToAnalyses(demos);
}
//# sourceMappingURL=add-demos-to-analyses-handler.js.map