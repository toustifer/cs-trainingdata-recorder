import { useMatchesState } from './use-matches-state';
export function useMatchesStatus() {
    const state = useMatchesState();
    return state.status;
}
//# sourceMappingURL=use-matches-status.js.map