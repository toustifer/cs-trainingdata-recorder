import { useGrenadesFinderState } from './use-grenades-finder-state';
export function useSelectedGrenadeName() {
    const state = useGrenadesFinderState();
    return state.grenadeName;
}
//# sourceMappingURL=use-selected-grenade-name.js.map