import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Tooltip } from 'csdm/ui/components/tooltip';
import { getTimeElapsedBetweenTicks } from 'csdm/ui/match/get-time-elapsed-between-ticks';
import { Indicator } from 'csdm/ui/match/viewer-2d/playback-bar/indicator';
import { useViewerContext } from 'csdm/ui/match/viewer-2d/use-viewer-context';
export function FreezetimeEndIndicator({ leftX }) {
    const { round, tickrate } = useViewerContext();
    const time = getTimeElapsedBetweenTicks({
        tickrate: tickrate,
        startTick: round.startTick,
        endTick: round.freezetimeEndTick,
    });
    return (React.createElement(Tooltip, { content: React.createElement(Trans, null,
            time,
            " Freeze time ended"), placement: "top" },
        React.createElement(Indicator, { leftX: leftX, color: "#12805c" })));
}
//# sourceMappingURL=freezetime-end-indicator.js.map