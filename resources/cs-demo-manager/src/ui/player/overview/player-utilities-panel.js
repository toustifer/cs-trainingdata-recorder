import React, {} from 'react';
import { Trans } from '@lingui/react/macro';
import { Panel, PanelRow, PanelTitle, PanelValue } from 'csdm/ui/components/panel';
import { Tooltip } from 'csdm/ui/components/tooltip';
function Row({ title, value, tooltip }) {
    return (React.createElement(Tooltip, { content: React.createElement("div", { className: "max-w-[300px]" }, tooltip) },
        React.createElement("div", null,
            React.createElement(PanelRow, null,
                React.createElement("p", null, title),
                React.createElement(PanelValue, null, value)))));
}
export function PlayerUtilitiesPanel({ averageBlindTime, averageEnemiesFlashed, averageHeGrenadeDamage, averageSmokesThrownPerMatch, }) {
    return (React.createElement(Panel, { header: React.createElement(PanelTitle, null,
            React.createElement(Trans, { context: "Panel title" }, "Utilities")) },
        React.createElement(Row, { tooltip: React.createElement(Trans, null, "On average, how long enemies stay blind whilst affected by a player's flashbang."), title: React.createElement(Trans, { context: "Panel label" }, "Avg blind time"), value: React.createElement(Trans, { context: "Seconds" },
                averageBlindTime,
                "s") }),
        React.createElement(Row, { tooltip: React.createElement(Trans, null, "The average number of enemies blinded per flashbang thrown by the player. This includes only 5v5 matches, so the maximum possible value is 5."), title: React.createElement(Trans, { context: "Panel label" }, "Enemies flashed"), value: averageEnemiesFlashed }),
        React.createElement(Row, { tooltip: React.createElement(Trans, null, "On average, how much damage is dealt to enemies with HE grenades thrown by the player."), title: React.createElement(Trans, { context: "Panel label" }, "Avg HE damages"), value: averageHeGrenadeDamage }),
        React.createElement(Row, { tooltip: React.createElement(Trans, null, "On average, how many smokes are thrown by the player in a single match. This includes only 5v5 matches."), title: React.createElement(Trans, { context: "Panel label" }, "Avg smokes thrown"), value: averageSmokesThrownPerMatch })));
}
//# sourceMappingURL=player-utilities-panel.js.map