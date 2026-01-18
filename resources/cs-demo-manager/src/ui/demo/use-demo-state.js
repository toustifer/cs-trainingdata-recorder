import { useSelector } from 'csdm/ui/store/use-selector';
export function useDemoState() {
    const demoState = useSelector((state) => state.demo);
    return demoState;
}
//# sourceMappingURL=use-demo-state.js.map