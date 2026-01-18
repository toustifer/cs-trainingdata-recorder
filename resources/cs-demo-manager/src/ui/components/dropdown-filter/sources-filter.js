import React from 'react';
import { Trans } from '@lingui/react/macro';
import { useDemoSources } from 'csdm/ui/demos/use-demo-sources';
import { FilterCategory } from 'csdm/ui/components/dropdown-filter/filter-category';
import { FilterValue } from 'csdm/ui/components/dropdown-filter/filter-value';
import { FilterSelection } from 'csdm/ui/components/dropdown-filter/filter-selection';
export function SourcesFilter({ selectedSources, onChange, hasActiveFilter }) {
    const sources = useDemoSources();
    const onSelectAllClick = () => {
        const allSources = sources.map((source) => source.value);
        onChange(allSources);
    };
    const onDeselectAllClick = () => {
        onChange([]);
    };
    return (React.createElement(FilterCategory, { name: React.createElement(Trans, { context: "Demo source filter label" }, "Sources"), right: React.createElement(FilterSelection, { hasActiveFilter: hasActiveFilter, onSelectAllClick: onSelectAllClick, onDeselectAllClick: onDeselectAllClick }) }, sources.map((source) => {
        const isSelected = selectedSources.includes(source.value);
        const onClick = () => {
            const newSelectedSources = isSelected
                ? selectedSources.filter((sourceName) => sourceName !== source.value)
                : [...selectedSources, source.value];
            onChange(newSelectedSources);
        };
        return (React.createElement(FilterValue, { isSelected: isSelected, key: source.value, onClick: onClick },
            React.createElement("span", null, source.name)));
    })));
}
//# sourceMappingURL=sources-filter.js.map