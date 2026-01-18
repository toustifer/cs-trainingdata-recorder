import { useNavigate } from 'react-router';
import { buildTeamPath } from 'csdm/ui/routes-paths';
export function useNavigateToTeam() {
    const navigate = useNavigate();
    return (name) => {
        navigate(buildTeamPath(name));
    };
}
//# sourceMappingURL=use-navigate-to-team.js.map