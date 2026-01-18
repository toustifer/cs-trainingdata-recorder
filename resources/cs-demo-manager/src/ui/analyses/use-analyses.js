import { useAnalysesState } from './use-analyses-state';
export function useAnalyses() {
    const analysesState = useAnalysesState();
    return analysesState.analyses;
}
//# sourceMappingURL=use-analyses.js.map