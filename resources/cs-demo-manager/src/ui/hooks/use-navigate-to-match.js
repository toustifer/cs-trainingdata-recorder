import { useNavigate } from 'react-router';
import { buildMatchPath } from 'csdm/ui/routes-paths';
export function useNavigateToMatch() {
    const navigate = useNavigate();
    return (checksum, options) => {
        const matchPath = buildMatchPath(checksum);
        navigate(matchPath, options);
    };
}
//# sourceMappingURL=use-navigate-to-match.js.map