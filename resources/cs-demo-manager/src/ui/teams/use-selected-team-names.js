import { useTeamsState } from './use-teams-state';
export function useSelectedTeamNames() {
    const state = useTeamsState();
    return state.selectedTeamNames;
}
//# sourceMappingURL=use-selected-team-names.js.map