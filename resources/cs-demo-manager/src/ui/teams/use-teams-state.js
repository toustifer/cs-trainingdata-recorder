import { useSelector } from 'csdm/ui/store/use-selector';
export function useTeamsState() {
    const state = useSelector((state) => state.teams);
    return state;
}
//# sourceMappingURL=use-teams-state.js.map