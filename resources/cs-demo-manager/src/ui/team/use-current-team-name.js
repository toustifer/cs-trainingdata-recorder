import { useParams } from 'react-router';
export function useCurrentTeamName() {
    const { name } = useParams();
    if (typeof name !== 'string') {
        throw new TypeError('team name is not a string');
    }
    return name;
}
//# sourceMappingURL=use-current-team-name.js.map