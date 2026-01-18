import { useNavigate } from 'react-router';
import { buildMatchPlayerPath } from 'csdm/ui/routes-paths';
export function useNavigateToMatchPlayer() {
    const navigate = useNavigate();
    return (checksum, steamId) => {
        return navigate(buildMatchPlayerPath(checksum, steamId));
    };
}
//# sourceMappingURL=use-navigate-to-match-player.js.map