import { useMatchesState } from './use-matches-state';
export function useSelectedMatchChecksums() {
    const state = useMatchesState();
    return state.selectedChecksums;
}
//# sourceMappingURL=use-selected-match-checksums.js.map