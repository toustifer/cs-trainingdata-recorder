import { useTeamsState } from './use-teams-state';
export function useFuzzySearchText() {
    const state = useTeamsState();
    return state.fuzzySearchText;
}
//# sourceMappingURL=use-fuzzy-search-text.js.map