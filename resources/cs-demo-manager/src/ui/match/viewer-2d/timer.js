import React from 'react';
import clsx from 'clsx';
import { useViewerContext } from './use-viewer-context';
import { formatMillisecondsToTimer } from 'csdm/ui/shared/format-milliseconds-to-timer';
export function Timer() {
    const { timeRemaining, bombPlanted, currentTick, tickrate, round } = useViewerContext();
    const remainingTimer = formatMillisecondsToTimer(timeRemaining);
    const isBombPlanted = bombPlanted !== null && bombPlanted.tick <= currentTick;
    const elapsedTickCount = currentTick - round.freezetimeEndTick;
    const elapsedTimer = formatMillisecondsToTimer((elapsedTickCount / tickrate) * 1000);
    return (React.createElement("div", { className: "absolute top-16 left-1/2 flex -translate-x-1/2 gap-4 rounded bg-gray-200 px-8 py-4" },
        React.createElement("p", { className: clsx('text-body-strong', {
                'text-red-700': isBombPlanted,
            }) }, remainingTimer),
        React.createElement("p", null, "/"),
        React.createElement("p", { className: "text-body-strong" }, elapsedTimer)));
}
//# sourceMappingURL=timer.js.map