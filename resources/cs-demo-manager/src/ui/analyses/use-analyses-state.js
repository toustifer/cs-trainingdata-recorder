import { useSelector } from 'csdm/ui/store/use-selector';
export function useAnalysesState() {
    const analysesState = useSelector((state) => state.analyses);
    return analysesState;
}
//# sourceMappingURL=use-analyses-state.js.map