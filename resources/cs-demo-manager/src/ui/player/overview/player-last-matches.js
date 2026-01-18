import React from 'react';
import { usePlayer } from '../use-player';
import { LastMatches } from 'csdm/ui/components/last-matches';
export function PlayerLastMatches() {
    const { lastMatches } = usePlayer();
    return React.createElement(LastMatches, { matches: lastMatches });
}
//# sourceMappingURL=player-last-matches.js.map