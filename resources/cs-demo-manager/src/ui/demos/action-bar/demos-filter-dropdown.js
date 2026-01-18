import React from 'react';
import { DropdownFilter } from 'csdm/ui/components/dropdown-filter/dropdown-filter';
import { useDemosLoaded } from 'csdm/ui/demos/use-demos-loaded';
import { FilterSeparator } from 'csdm/ui/components/dropdown-filter/filter-separator';
import { formatDate } from 'csdm/common/date/date-range';
import { PeriodFilter } from 'csdm/ui/components/dropdown-filter/period-filter';
import { SourcesFilter } from 'csdm/ui/components/dropdown-filter/sources-filter';
import { TagsFilter } from 'csdm/ui/components/dropdown-filter/tags-filter';
import { useActiveDemosFilters } from 'csdm/ui/demos/use-active-demos-filters';
import { useFetchDemos } from 'csdm/ui/demos/use-fetch-demos';
import { AnalysisStatusSelect } from 'csdm/ui/components/dropdown-filter/analysis-status-select';
import { useDemosSettings } from 'csdm/ui/settings/use-demos-settings';
import { DemoTypesFilter } from 'csdm/ui/components/dropdown-filter/demo-types-filter';
import { GameFilter } from 'csdm/ui/components/dropdown-filter/game-filter';
export function DemosFilterDropdown() {
    const areDemosLoaded = useDemosLoaded();
    const { sources, types, games, tagIds, startDate, endDate, analysisStatus, updateSettings } = useDemosSettings();
    const { hasActiveFilter, hasActiveSourcesFilter, hasActiveTagsFilter, hasActiveTypesFilter, hasActiveGamesFilter } = useActiveDemosFilters();
    const fetchDemos = useFetchDemos();
    const onPeriodChange = (range) => {
        const startDate = formatDate(range?.from);
        const endDate = formatDate(range?.to);
        fetchDemos({
            startDate,
            endDate,
        });
    };
    const onSourcesChange = (sources) => {
        fetchDemos({
            sources,
        });
    };
    const onDemoTypesChange = (types) => {
        fetchDemos({
            types,
        });
    };
    const onGamesChange = (games) => {
        fetchDemos({
            games,
        });
    };
    const onAnalysisStatusChange = (analysisStatus) => {
        updateSettings({
            analysisStatus,
        });
    };
    const onTagsChange = (tagIds) => {
        fetchDemos({
            tagIds,
        });
    };
    return (React.createElement(DropdownFilter, { isDisabled: !areDemosLoaded, hasActiveFilter: hasActiveFilter },
        React.createElement("div", { className: "flex" },
            React.createElement("div", { className: "flex flex-col p-8" },
                React.createElement(PeriodFilter, { startDate: startDate, endDate: endDate, onRangeChange: onPeriodChange })),
            React.createElement("div", { className: "w-[424px] border-l border-l-gray-300" },
                React.createElement("div", { className: "p-8" },
                    React.createElement(SourcesFilter, { selectedSources: sources, onChange: onSourcesChange, hasActiveFilter: hasActiveSourcesFilter })),
                React.createElement(FilterSeparator, null),
                React.createElement("div", { className: "p-8" },
                    React.createElement(TagsFilter, { selectedTagIds: tagIds, onChange: onTagsChange, hasActiveFilter: hasActiveTagsFilter })),
                React.createElement(FilterSeparator, null),
                React.createElement("div", { className: "p-8" },
                    React.createElement(DemoTypesFilter, { selectedTypes: types, onChange: onDemoTypesChange, hasActiveFilter: hasActiveTypesFilter })),
                React.createElement(FilterSeparator, null),
                React.createElement("div", { className: "p-8" },
                    React.createElement(AnalysisStatusSelect, { selectedStatus: analysisStatus, onChange: onAnalysisStatusChange })),
                React.createElement(FilterSeparator, null),
                React.createElement("div", { className: "p-8" },
                    React.createElement(GameFilter, { selectedGames: games, onChange: onGamesChange, hasActiveFilter: hasActiveGamesFilter }))))));
}
//# sourceMappingURL=demos-filter-dropdown.js.map