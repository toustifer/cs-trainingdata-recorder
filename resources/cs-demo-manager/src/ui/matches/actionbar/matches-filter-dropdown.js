import React from 'react';
import { DropdownFilter } from 'csdm/ui/components/dropdown-filter/dropdown-filter';
import { SourcesFilter } from 'csdm/ui/components/dropdown-filter/sources-filter';
import { TagsFilter } from 'csdm/ui/components/dropdown-filter/tags-filter';
import { GameModesFilter } from 'csdm/ui/components/dropdown-filter/game-modes-filter';
import { RankingSelect } from 'csdm/ui/components/dropdown-filter/ranking-select';
import { PeriodFilter } from 'csdm/ui/components/dropdown-filter/period-filter';
import { FilterSeparator } from 'csdm/ui/components/dropdown-filter/filter-separator';
import { RankingFilter } from 'csdm/common/types/ranking-filter';
import { useMatchesLoaded } from 'csdm/ui/matches/use-matches-loaded';
import { useFetchMatches } from 'csdm/ui/matches/use-fetch-matches';
import { formatDate } from 'csdm/common/date/date-range';
import { useActiveMatchesFilters } from '../use-active-matches-filters';
import { MatchLengthFilter } from 'csdm/ui/components/dropdown-filter/match-length-filter';
import { useMatchesSettings } from 'csdm/ui/settings/use-matches-settings';
import { DemoTypesFilter } from 'csdm/ui/components/dropdown-filter/demo-types-filter';
import { GameFilter } from 'csdm/ui/components/dropdown-filter/game-filter';
export function MatchesFilterDropdown() {
    const areMatchesLoaded = useMatchesLoaded();
    const { sources, gameModes, games, ranking, tagIds, startDate, endDate, maxRounds, demoTypes } = useMatchesSettings();
    const fetchMatches = useFetchMatches();
    const { hasActiveFilter, hasActiveSourcesFilter, hasActiveTagsFilter, hasActiveGameModesFilter, hasActiveGameLengthFilter, hasActiveDemoTypesFilter, hasActiveGamesFilter, } = useActiveMatchesFilters();
    const onSourcesChange = (sources) => {
        fetchMatches({
            demoSources: sources,
        });
    };
    const onGamesChange = (games) => {
        fetchMatches({
            games,
        });
    };
    const onGameModesChange = (gameModes) => {
        fetchMatches({
            gameModes,
        });
    };
    const onTagsChange = (tagIds) => {
        fetchMatches({
            tagIds,
        });
    };
    const onRankingChange = (ranking) => {
        fetchMatches({
            ranking,
        });
    };
    const onMatchLengthChanged = (maxRounds) => {
        fetchMatches({
            maxRounds,
        });
    };
    const onDemoTypesChanged = (demoTypes) => {
        fetchMatches({
            demoTypes,
        });
    };
    const onPeriodChange = (range) => {
        const startDate = formatDate(range?.from);
        const endDate = formatDate(range?.to);
        fetchMatches({
            startDate,
            endDate,
        });
    };
    return (React.createElement(DropdownFilter, { isDisabled: !areMatchesLoaded, hasActiveFilter: hasActiveFilter },
        React.createElement("div", { className: "flex" },
            React.createElement("div", { className: "flex flex-col p-8" },
                React.createElement(PeriodFilter, { startDate: startDate, endDate: endDate, onRangeChange: onPeriodChange })),
            React.createElement("div", { className: "w-[424px] border-l border-l-gray-300" },
                React.createElement("div", { className: "p-8" },
                    React.createElement(SourcesFilter, { selectedSources: sources, onChange: onSourcesChange, hasActiveFilter: hasActiveSourcesFilter })),
                React.createElement(FilterSeparator, null),
                React.createElement("div", { className: "p-8" },
                    React.createElement(GameModesFilter, { selectedGameModes: gameModes, onChange: onGameModesChange, hasActiveFilter: hasActiveGameModesFilter })),
                React.createElement(FilterSeparator, null),
                React.createElement("div", { className: "p-8" },
                    React.createElement(TagsFilter, { selectedTagIds: tagIds, onChange: onTagsChange, hasActiveFilter: hasActiveTagsFilter })),
                React.createElement(FilterSeparator, null),
                React.createElement("div", { className: "p-8" },
                    React.createElement(MatchLengthFilter, { selectedMaxRounds: maxRounds, onChange: onMatchLengthChanged, hasActiveFilter: hasActiveGameLengthFilter })),
                React.createElement(FilterSeparator, null),
                React.createElement("div", { className: "p-8" },
                    React.createElement(DemoTypesFilter, { selectedTypes: demoTypes, onChange: onDemoTypesChanged, hasActiveFilter: hasActiveDemoTypesFilter })),
                React.createElement(FilterSeparator, null),
                React.createElement("div", { className: "p-8" },
                    React.createElement(RankingSelect, { selectedRanking: ranking ?? RankingFilter.All, onChange: onRankingChange })),
                React.createElement(FilterSeparator, null),
                React.createElement("div", { className: "p-8" },
                    React.createElement(GameFilter, { selectedGames: games, onChange: onGamesChange, hasActiveFilter: hasActiveGamesFilter }))))));
}
//# sourceMappingURL=matches-filter-dropdown.js.map