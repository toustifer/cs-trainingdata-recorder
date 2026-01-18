import { useSelector } from 'csdm/ui/store/use-selector';
export function useDemosState() {
    const demosState = useSelector((state) => state.demos);
    return demosState;
}
//# sourceMappingURL=use-demos-state.js.map