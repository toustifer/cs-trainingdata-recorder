import { useTeamState } from '../use-team-state';
export function useSelectedMatchChecksums() {
    const { selectedMatchChecksums } = useTeamState();
    return selectedMatchChecksums;
}
//# sourceMappingURL=use-selected-match-checksums.js.map