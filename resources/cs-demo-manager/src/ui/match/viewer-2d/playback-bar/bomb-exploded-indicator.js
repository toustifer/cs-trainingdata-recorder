import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Tooltip } from 'csdm/ui/components/tooltip';
import { getTimeElapsedBetweenTicks } from 'csdm/ui/match/get-time-elapsed-between-ticks';
import { Indicator } from 'csdm/ui/match/viewer-2d/playback-bar/indicator';
import { useViewerContext } from 'csdm/ui/match/viewer-2d/use-viewer-context';
export function BombExplodedIndicator({ tick, leftX, planterName, site }) {
    const { round, tickrate } = useViewerContext();
    const time = getTimeElapsedBetweenTicks({
        tickrate,
        startTick: round.freezetimeEndTick,
        endTick: tick,
    });
    return (React.createElement(Tooltip, { content: React.createElement("p", { className: "w-max" },
            React.createElement(Trans, null,
                time,
                " Bomb planted by ",
                planterName,
                " exploded at site ",
                site)), placement: "top" },
        React.createElement(Indicator, { leftX: leftX, color: "#c9252d" })));
}
//# sourceMappingURL=bomb-exploded-indicator.js.map