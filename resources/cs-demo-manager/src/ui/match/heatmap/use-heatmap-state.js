import { useSelector } from 'csdm/ui/store/use-selector';
export function useHeatmapState() {
    return useSelector((state) => state.match.heatmap);
}
//# sourceMappingURL=use-heatmap-state.js.map