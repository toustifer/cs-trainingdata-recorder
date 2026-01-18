import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Panel, PanelRow, PanelTitle, PanelValue } from 'csdm/ui/components/panel';
import { usePlayer } from '../use-player';
import { PremierRank } from 'csdm/ui/components/premier-rank';
export function MatchmakingPanel() {
    const { competitiveRank, premierRank, winsCount } = usePlayer();
    return (React.createElement(Panel, { header: React.createElement(PanelTitle, null,
            React.createElement(Trans, { context: "Panel title" }, "Matchmaking")), minWidth: 200 },
        React.createElement(PanelRow, null,
            React.createElement("p", null,
                React.createElement(Trans, { context: "Panel label" }, "Premier rank")),
            React.createElement("div", { className: "mb-4 flex h-full w-[64px]" },
                React.createElement(PremierRank, { rank: premierRank }))),
        React.createElement(PanelRow, null,
            React.createElement("p", null,
                React.createElement(Trans, { context: "Panel label" }, "Competitive rank")),
            React.createElement("div", { className: "mb-4 flex h-full w-[64px]" },
                React.createElement("img", { src: window.csdm.getRankImageSrc(competitiveRank) }))),
        React.createElement(PanelRow, null,
            React.createElement("p", null,
                React.createElement(Trans, { context: "Panel label" }, "Wins")),
            React.createElement(PanelValue, null, winsCount))));
}
//# sourceMappingURL=matchmaking-panel.js.map