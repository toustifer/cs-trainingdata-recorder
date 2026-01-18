import React from 'react';
import { useTeam } from '../use-team';
import { LastMatches } from 'csdm/ui/components/last-matches';
export function TeamLastMatches() {
    const { lastMatches } = useTeam();
    return React.createElement(LastMatches, { matches: lastMatches });
}
//# sourceMappingURL=team-last-matches.js.map