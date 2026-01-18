import React from 'react';
import clsx from 'clsx';
import { Avatar } from 'csdm/ui/components/avatar';
import { FlashbangCells } from 'csdm/ui/match/grenades/stats/cells/flashbang-cells';
import { FireCells } from 'csdm/ui/match/grenades/stats/cells/fire-cells';
import { HeGrenadeCells } from 'csdm/ui/match/grenades/stats/cells/he-grenade-cells';
import { SmokeCells } from 'csdm/ui/match/grenades/stats/cells/smoke-cells';
import { GrenadeOption } from 'csdm/ui/match/grenades/stats/grenade-option';
import { Tooltip } from 'csdm/ui/components/tooltip';
function renderCellsForGrenade(grenade, playerSteamId) {
    switch (grenade) {
        case GrenadeOption.Flashbang:
            return React.createElement(FlashbangCells, { playerSteamId: playerSteamId });
        case GrenadeOption.Fire:
            return React.createElement(FireCells, { playerSteamId: playerSteamId });
        case GrenadeOption.HE:
            return React.createElement(HeGrenadeCells, { playerSteamId: playerSteamId });
        case GrenadeOption.Smoke:
            return React.createElement(SmokeCells, { playerSteamId: playerSteamId });
        default:
            logger.warn(`Unknown grenade ${grenade}`);
    }
}
export function PlayersStatsGrid({ players, teamName, grenade }) {
    return (React.createElement(React.Fragment, null,
        React.createElement("p", { className: "text-body-strong" }, teamName),
        React.createElement("div", { className: "row-start-2 mt-8 grid", style: {
                gridTemplateColumns: `repeat(${players.length}, 72px)`,
            } }, players.map((player, index) => {
            const isLastPlayer = index === players.length - 1;
            return (React.createElement("div", { key: player.steamId },
                React.createElement(Tooltip, { content: player.name, placement: "top" },
                    React.createElement("div", { className: "mb-8" },
                        React.createElement(Avatar, { avatarUrl: player.avatar, size: 60, playerColor: player.color }),
                        React.createElement("p", { className: "selectable truncate", title: player.name }, player.name))),
                React.createElement("div", { className: clsx({
                        'border-r border-r-gray-300': !isLastPlayer,
                    }) }, renderCellsForGrenade(grenade, player.steamId))));
        }))));
}
//# sourceMappingURL=players-stats-grid.js.map