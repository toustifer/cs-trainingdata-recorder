import { useNavigate } from 'react-router';
import { buildPlayerPath } from 'csdm/ui/routes-paths';
export function useNavigateToPlayer() {
    const navigate = useNavigate();
    return (steamId) => {
        navigate(buildPlayerPath(steamId));
    };
}
//# sourceMappingURL=use-navigate-to-player.js.map