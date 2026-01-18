import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Tooltip } from 'csdm/ui/components/tooltip';
import { getTimeElapsedBetweenTicks } from 'csdm/ui/match/get-time-elapsed-between-ticks';
import { Indicator } from 'csdm/ui/match/viewer-2d/playback-bar/indicator';
import { useViewerContext } from 'csdm/ui/match/viewer-2d/use-viewer-context';
export function BombPlantedIndicator({ tick, leftX, planterName, site }) {
    const { round, tickrate } = useViewerContext();
    const siteBlockWidth = 35;
    const center = siteBlockWidth / 2;
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
                " at bomb site ",
                site)), placement: "top" },
        React.createElement("div", { className: "absolute flex h-full items-center", style: {
                left: leftX - center,
            } },
            React.createElement("div", { className: "z-1 flex h-24 items-center justify-center rounded bg-[#c9252d]", style: {
                    width: siteBlockWidth,
                } },
                React.createElement("p", { className: "text-body-strong text-gray-50" }, site)),
            React.createElement(Indicator, { leftX: center, color: "#c9252d" }))));
}
//# sourceMappingURL=bomb-planted-indicator.js.map