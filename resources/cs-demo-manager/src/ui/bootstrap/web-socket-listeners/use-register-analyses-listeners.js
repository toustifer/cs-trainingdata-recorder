import { useEffect } from 'react';
import { RendererServerMessageName } from 'csdm/server/renderer-server-message-name';
import { demosAddedToAnalyses, demoRemovedFromAnalyses, analysisUpdated, insertMatchSuccess, } from 'csdm/ui/analyses/analyses-actions';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
export function useRegisterAnalysesListeners(client) {
    const dispatch = useDispatch();
    useEffect(() => {
        const onDemoAddedToAnalyses = (analyses) => {
            dispatch(demosAddedToAnalyses(analyses));
        };
        client.on(RendererServerMessageName.DemosAddedToAnalyses, onDemoAddedToAnalyses);
        const onDemosRemovedFromAnalyses = (demoIds) => {
            dispatch(demoRemovedFromAnalyses(demoIds));
        };
        client.on(RendererServerMessageName.DemosRemovedFromAnalyses, onDemosRemovedFromAnalyses);
        const onAnalysisUpdated = (analysis) => {
            dispatch(analysisUpdated(analysis));
        };
        client.on(RendererServerMessageName.AnalysisUpdated, onAnalysisUpdated);
        const onMatchInserted = (match) => {
            dispatch(insertMatchSuccess(match));
        };
        client.on(RendererServerMessageName.MatchInserted, onMatchInserted);
        return () => {
            client.off(RendererServerMessageName.DemosAddedToAnalyses, onDemoAddedToAnalyses);
            client.off(RendererServerMessageName.DemosRemovedFromAnalyses, onDemosRemovedFromAnalyses);
            client.off(RendererServerMessageName.AnalysisUpdated, onAnalysisUpdated);
            client.off(RendererServerMessageName.MatchInserted, onMatchInserted);
        };
    });
}
//# sourceMappingURL=use-register-analyses-listeners.js.map