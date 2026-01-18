import React from 'react';
import { DropdownFilter } from 'csdm/ui/components/dropdown-filter/dropdown-filter';
import { BansFilter } from './ban-filter';
import { useFetchPlayers } from '../use-fetch-players';
import { useActivePlayersFilters } from '../use-active-players-filters';
import { usePlayersSettings } from 'csdm/ui/settings/use-players-settings';
import { PeriodFilter } from 'csdm/ui/components/dropdown-filter/period-filter';
import { formatDate } from 'csdm/common/date/date-range';
import { TagsFilter } from 'csdm/ui/components/dropdown-filter/tags-filter';
export function PlayersFilterDropdown() {
    const fetchPlayers = useFetchPlayers();
    const { bans, startDate, endDate, tagIds } = usePlayersSettings();
    const { hasActiveFilter, hasActiveBanFilters, hasActiveTagsFilter } = useActivePlayersFilters();
    const onBansChange = (bans) => {
        fetchPlayers({
            bans,
        });
    };
    const onPeriodChange = (range) => {
        const startDate = formatDate(range?.from);
        const endDate = formatDate(range?.to);
        fetchPlayers({
            startDate,
            endDate,
        });
    };
    const onTagsChange = (tagIds) => {
        fetchPlayers({
            tagIds,
        });
    };
    return (React.createElement(DropdownFilter, { hasActiveFilter: hasActiveFilter },
        React.createElement("div", { className: "flex" },
            React.createElement("div", { className: "flex flex-col p-8" },
                React.createElement(PeriodFilter, { startDate: startDate, endDate: endDate, onRangeChange: onPeriodChange })),
            React.createElement("div", { className: "w-[300px] border-l border-l-gray-300" },
                React.createElement("div", { className: "p-8" },
                    React.createElement(BansFilter, { selectedBans: bans, onChange: onBansChange, hasActiveFilter: hasActiveBanFilters })),
                React.createElement("div", { className: "p-8" },
                    React.createElement(TagsFilter, { selectedTagIds: tagIds, onChange: onTagsChange, hasActiveFilter: hasActiveTagsFilter }))))));
}
//# sourceMappingURL=players-filter-dropdown.js.map