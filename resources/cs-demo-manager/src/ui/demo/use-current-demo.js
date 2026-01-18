import { useDemoState } from './use-demo-state';
export function useCurrentDemo() {
    const demoState = useDemoState();
    if (!demoState.demo) {
        throw new Error('Demo not defined in state');
    }
    return demoState.demo;
}
//# sourceMappingURL=use-current-demo.js.map