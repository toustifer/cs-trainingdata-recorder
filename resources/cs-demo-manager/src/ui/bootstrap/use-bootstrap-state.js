import { useSelector } from 'csdm/ui/store/use-selector';
export function useBootstrapState() {
    const bootstrapState = useSelector((state) => state.bootstrap);
    return bootstrapState;
}
//# sourceMappingURL=use-bootstrap-state.js.map