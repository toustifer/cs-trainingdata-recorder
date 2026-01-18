import { usePlayersState } from './use-players-state';
export function useSelectedPlayerSteamIds() {
    const state = usePlayersState();
    return state.selectedPlayerSteamIds;
}
//# sourceMappingURL=use-selected-players-steamids.js.map