import React, {} from 'react';
import { Trans } from '@lingui/react/macro';
import { Panel, PanelTitle } from 'csdm/ui/components/panel';
import { PlayDemoAtTickButton } from '../rounds/play-demo-at-tick-button';
import { useBooleanHuman } from 'csdm/ui/hooks/use-boolean-to-human';
function Value({ children }) {
    return React.createElement("span", { className: "selectable text-right" }, children);
}
export function ClutchesPanel({ clutches, playerSteamId, demoPath, game, tickrate }) {
    const playerClutches = clutches.filter((clutch) => {
        return clutch.clutcherSteamId === playerSteamId;
    });
    const booleanToHuman = useBooleanHuman();
    return (React.createElement(Panel, { header: React.createElement(PanelTitle, null,
            React.createElement(Trans, { context: "Panel title" }, "Clutches")), fitHeight: true },
        React.createElement("div", { className: "grid grid-cols-6 gap-8 text-gray-900" },
            React.createElement("p", null,
                React.createElement(Trans, { context: "Panel label" }, "Round")),
            React.createElement("p", { className: "text-right" },
                React.createElement(Trans, { context: "Panel label" }, "Opponents")),
            React.createElement("p", { className: "text-right" },
                React.createElement(Trans, { context: "Panel label" }, "Won")),
            React.createElement("p", { className: "text-right" },
                React.createElement(Trans, { context: "Panel label" }, "Survived")),
            React.createElement("p", { className: "text-right" },
                React.createElement(Trans, { context: "Panel label" }, "Kills"))),
        React.createElement("div", { className: "flex flex-col" }, playerClutches.map((clutch) => {
            return (React.createElement("div", { className: "grid grid-cols-6 gap-8", key: clutch.id },
                React.createElement("span", { className: "selectable" }, clutch.roundNumber),
                React.createElement(Value, null, clutch.opponentCount),
                React.createElement(Value, null, booleanToHuman(clutch.won)),
                React.createElement(Value, null, booleanToHuman(clutch.hasClutcherSurvived)),
                React.createElement(Value, null, clutch.clutcherKillCount),
                React.createElement("div", { className: "ml-auto" },
                    React.createElement(PlayDemoAtTickButton, { demoPath: demoPath, game: game, tick: clutch.tick - 5 * tickrate, tooltip: React.createElement(Trans, { context: "Tooltip" }, "Watch clutch"), focusSteamId: playerSteamId, size: 20 }))));
        }))));
}
//# sourceMappingURL=clutches-panel.js.map