import React from 'react';
import { Tooltip } from 'csdm/ui/components/tooltip';
import { Indicator } from 'csdm/ui/match/viewer-2d/playback-bar/indicator';
import { KillFeedEntry } from 'csdm/ui/components/kill-feed-entry';
import { useViewerContext } from 'csdm/ui/match/viewer-2d/use-viewer-context';
import { getTeamColor } from '../../../styles/get-team-color';
import { useCurrentMatch } from '../../use-current-match';
export function KillIndicator({ kill, leftX }) {
    const { round } = useViewerContext();
    const color = getTeamColor(kill.victimSide);
    const match = useCurrentMatch();
    return (React.createElement(Tooltip, { content: React.createElement(KillFeedEntry, { kill: kill, timeElapsedOption: {
                tickrate: match.tickrate,
                roundFreezetimeEndTick: round.freezetimeEndTick,
            } }), placement: "top" },
        React.createElement(Indicator, { leftX: leftX, color: color })));
}
//# sourceMappingURL=kill-indicator.js.map