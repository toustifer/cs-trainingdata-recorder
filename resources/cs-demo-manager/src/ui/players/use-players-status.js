import { usePlayersState } from './use-players-state';
export function usePlayersStatus() {
    const state = usePlayersState();
    return state.status;
}
//# sourceMappingURL=use-players-status.js.map