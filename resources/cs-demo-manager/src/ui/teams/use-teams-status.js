import { useTeamsState } from './use-teams-state';
export function useTeamsStatus() {
    const state = useTeamsState();
    return state.status;
}
//# sourceMappingURL=use-teams-status.js.map