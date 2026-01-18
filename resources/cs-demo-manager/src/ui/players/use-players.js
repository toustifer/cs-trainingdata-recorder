import { usePlayersState } from './use-players-state';
export function usePlayers() {
    const state = usePlayersState();
    return state.entities;
}
//# sourceMappingURL=use-players.js.map