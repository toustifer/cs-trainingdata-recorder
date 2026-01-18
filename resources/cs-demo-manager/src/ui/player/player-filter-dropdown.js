import React from 'react';
import { DropdownFilter } from 'csdm/ui/components/dropdown-filter/dropdown-filter';
import { FilterSeparator } from 'csdm/ui/components/dropdown-filter/filter-separator';
import { usePlayerProfileSettings } from 'csdm/ui/settings/use-player-profile-settings';
import { useFetchPlayer } from './use-fetch-player';
import { formatDate } from 'csdm/common/date/date-range';
import { PeriodFilter } from 'csdm/ui/components/dropdown-filter/period-filter';
import { SourcesFilter } from 'csdm/ui/components/dropdown-filter/sources-filter';
import { GameModesFilter } from 'csdm/ui/components/dropdown-filter/game-modes-filter';
import { TagsFilter } from 'csdm/ui/components/dropdown-filter/tags-filter';
import { RankingSelect } from 'csdm/ui/components/dropdown-filter/ranking-select';
import { MatchLengthFilter } from 'csdm/ui/components/dropdown-filter/match-length-filter';
import { useActivePlayerFilters } from './use-active-player-filters';
import { DemoTypesFilter } from '../components/dropdown-filter/demo-types-filter';
import { GameFilter } from '../components/dropdown-filter/game-filter';
export function PlayerFilterDropdown() {
    const { demoSources, games, gameModes, ranking, tagIds, maxRounds, startDate, endDate, demoTypes } = usePlayerProfileSettings();
    const fetchPlayer = useFetchPlayer();
    const { hasActiveFilter, hasActiveGamesFilter, hasActiveSourcesFilter, hasActiveTagsFilter, hasActiveGameModesFilter, hasActiveGameLengthFilter, hasActiveDemoTypesFilter, } = useActivePlayerFilters();
    const onGamesChange = (games) => {
        fetchPlayer({
            games,
        });
    };
    const onSourcesChange = (sources) => {
        fetchPlayer({
            demoSources: sources,
        });
    };
    const onGameModesChange = (modes) => {
        fetchPlayer({
            gameModes: modes,
        });
    };
    const onTagsChange = (tagIds) => {
        fetchPlayer({
            tagIds,
        });
    };
    const onRankingChange = (ranking) => {
        fetchPlayer({
            ranking,
        });
    };
    const onMatchLengthChange = (maxRounds) => {
        fetchPlayer({
            maxRounds,
        });
    };
    const onDemoTypesChange = (demoTypes) => {
        fetchPlayer({
            demoTypes,
        });
    };
    const onPeriodChange = (range) => {
        const startDate = formatDate(range?.from);
        const endDate = formatDate(range?.to);
        fetchPlayer({
            startDate,
            endDate,
        });
    };
    return (React.createElement(DropdownFilter, { hasActiveFilter: hasActiveFilter },
        React.createElement("div", { className: "flex" },
            React.createElement("div", { className: "flex flex-col p-8" },
                React.createElement(PeriodFilter, { startDate: startDate, endDate: endDate, onRangeChange: onPeriodChange })),
            React.createElement("div", { className: "w-[424px] border-l border-l-gray-300" },
                React.createElement("div", { className: "p-8" },
                    React.createElement(SourcesFilter, { selectedSources: demoSources, onChange: onSourcesChange, hasActiveFilter: hasActiveSourcesFilter })),
                React.createElement(FilterSeparator, null),
                React.createElement("div", { className: "p-8" },
                    React.createElement(GameModesFilter, { selectedGameModes: gameModes, onChange: onGameModesChange, hasActiveFilter: hasActiveGameModesFilter })),
                React.createElement(FilterSeparator, null),
                React.createElement("div", { className: "p-8" },
                    React.createElement(TagsFilter, { selectedTagIds: tagIds, onChange: onTagsChange, hasActiveFilter: hasActiveTagsFilter })),
                React.createElement(FilterSeparator, null),
                React.createElement("div", { className: "p-8" },
                    React.createElement(MatchLengthFilter, { selectedMaxRounds: maxRounds, onChange: onMatchLengthChange, hasActiveFilter: hasActiveGameLengthFilter })),
                React.createElement(FilterSeparator, null),
                React.createElement("div", { className: "p-8" },
                    React.createElement(DemoTypesFilter, { selectedTypes: demoTypes, onChange: onDemoTypesChange, hasActiveFilter: hasActiveDemoTypesFilter })),
                React.createElement(FilterSeparator, null),
                React.createElement("div", { className: "p-8" },
                    React.createElement(RankingSelect, { selectedRanking: ranking, onChange: onRankingChange })),
                React.createElement(FilterSeparator, null),
                React.createElement("div", { className: "p-8" },
                    React.createElement(GameFilter, { selectedGames: games, onChange: onGamesChange, hasActiveFilter: hasActiveGamesFilter }))))));
}
//# sourceMappingURL=player-filter-dropdown.js.map