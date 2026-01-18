import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Panel, PanelRow, PanelTitle, PanelValue } from 'csdm/ui/components/panel';
import { usePlayer } from '../use-player';
import { WEAPONS_ICONS } from 'csdm/ui/components/weapons-icons';
import { Tooltip } from 'csdm/ui/components/tooltip';
import { WeaponName } from 'csdm/common/types/counter-strike';
export function PlayerOpeningDuelsStats() {
    const player = usePlayer();
    const { successPercentage, tradePercentage, bestWeapon } = player.openingDuelsStats;
    const WeaponIcon = WEAPONS_ICONS[bestWeapon];
    return (React.createElement(Panel, { header: React.createElement(PanelTitle, null,
            React.createElement(Trans, { context: "Panel title" }, "Opening duels")) },
        React.createElement(PanelRow, null,
            React.createElement("p", null, React.createElement(Trans, { context: "Panel label" }, "Success")),
            React.createElement(PanelValue, null, `${successPercentage}%`)),
        React.createElement(PanelRow, null,
            React.createElement("p", null, React.createElement(Trans, { context: "Panel label" }, "Traded")),
            React.createElement(PanelValue, null, `${tradePercentage}%`)),
        WeaponIcon && (React.createElement(PanelRow, null,
            React.createElement("p", null, React.createElement(Trans, { context: "Panel label" }, "Best weapon")),
            React.createElement(Tooltip, { content: bestWeapon },
                React.createElement("div", null,
                    React.createElement(PanelValue, null, bestWeapon === WeaponName.Unknown ? '-' : React.createElement(WeaponIcon, { className: "h-20" }))))))));
}
//# sourceMappingURL=player-opening-duels-panel.js.map