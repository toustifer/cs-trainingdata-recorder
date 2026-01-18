import { useSelector } from 'csdm/ui/store/use-selector';
export function usePlayersState() {
    const state = useSelector((state) => state.players);
    return state;
}
//# sourceMappingURL=use-players-state.js.map