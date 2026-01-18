import React, {} from 'react';
import { Trans } from '@lingui/react/macro';
import { FilterSelection } from 'csdm/ui/components/dropdown-filter/filter-selection';
import { FilterValue } from 'csdm/ui/components/dropdown-filter/filter-value';
export function PlayersSelect({ players, onChange, selectedSteamIds, filter = (React.createElement(FilterSelection, { onSelectAllClick: () => {
        onChange(players.map((round) => round.steamId));
    }, onDeselectAllClick: () => {
        onChange([]);
    } })), }) {
    return (React.createElement("div", { className: "flex flex-col gap-y-8" },
        React.createElement("div", { className: "flex items-baseline justify-between" },
            React.createElement("p", null,
                React.createElement(Trans, { context: "Players filter category" }, "Players")),
            React.createElement("div", { className: "mt-px ml-16" }, filter)),
        React.createElement("div", { className: "flex flex-wrap gap-4" }, players.map((player) => {
            const isSelected = selectedSteamIds.includes(player.steamId);
            return (React.createElement(FilterValue, { key: player.steamId, isSelected: isSelected, onClick: () => {
                    onChange(isSelected
                        ? selectedSteamIds.filter((steamId) => steamId !== player.steamId)
                        : [...selectedSteamIds, player.steamId]);
                } }, player.name));
        }))));
}
//# sourceMappingURL=players-select.js.map