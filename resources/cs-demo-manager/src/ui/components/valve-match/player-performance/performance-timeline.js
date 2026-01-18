import React from 'react';
import { Trans } from '@lingui/react/macro';
import { PerformanceTimeLineBar } from 'csdm/ui/components/valve-match/player-performance/performance-timeline-bar';
export function PerformanceTimeline({ player, demoPath, game }) {
    const playerName = player.name;
    return (React.createElement("div", { className: "mt-12 flex flex-col items-center justify-center" },
        React.createElement("p", null,
            React.createElement(Trans, null,
                React.createElement("span", { className: "text-body-strong" }, playerName),
                " Round performance")),
        React.createElement("div", { className: "mt-8 flex flex-1 items-center justify-center" }, player.rounds.map((round) => {
            return React.createElement(PerformanceTimeLineBar, { key: `round-${round.number}`, round: round, demoPath: demoPath, game: game });
        }))));
}
//# sourceMappingURL=performance-timeline.js.map