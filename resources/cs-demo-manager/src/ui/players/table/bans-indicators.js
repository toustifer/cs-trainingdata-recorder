import React from 'react';
import { Plural } from '@lingui/react/macro';
import { TableStatusBarLegend } from 'csdm/ui/components/table/status-bar/table-status-bar-legend';
import { TableStatusBarRectangle } from 'csdm/ui/components/table/status-bar/table-status-bar-rectangle';
import { usePlayersTable } from './use-players-table';
import { TableStatusBarSeparator } from 'csdm/ui/components/table/status-bar/table-status-bar-separator';
export function BansIndicators() {
    const table = usePlayersTable();
    let vacBannedPlayerCount = 0;
    let gameBannedPlayerCount = 0;
    let communityBannedPlayerCount = 0;
    for (const player of table.getRows()) {
        if (player.isVacBanned) {
            vacBannedPlayerCount++;
        }
        if (player.isGameBanned) {
            gameBannedPlayerCount++;
        }
        if (player.isCommunityBanned) {
            communityBannedPlayerCount++;
        }
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(TableStatusBarLegend, { rectangle: React.createElement(TableStatusBarRectangle, { className: "bg-vac-ban" }), text: React.createElement(Plural, { value: vacBannedPlayerCount, one: "# VAC ban", other: "# VAC bans" }) }),
        React.createElement(TableStatusBarSeparator, null),
        React.createElement(TableStatusBarLegend, { rectangle: React.createElement(TableStatusBarRectangle, { className: "bg-game-ban" }), text: React.createElement(Plural, { value: gameBannedPlayerCount, one: "# game ban", other: "# game bans" }) }),
        React.createElement(TableStatusBarSeparator, null),
        React.createElement(TableStatusBarLegend, { rectangle: React.createElement(TableStatusBarRectangle, { className: "bg-community-ban" }), text: React.createElement(Plural, { value: communityBannedPlayerCount, one: "# community ban", other: "# community bans" }) })));
}
//# sourceMappingURL=bans-indicators.js.map