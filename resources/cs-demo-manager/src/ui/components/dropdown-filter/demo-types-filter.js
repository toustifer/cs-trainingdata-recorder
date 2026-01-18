import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { FilterCategory } from 'csdm/ui/components/dropdown-filter/filter-category';
import { FilterValue } from 'csdm/ui/components/dropdown-filter/filter-value';
import { FilterSelection } from './filter-selection';
import { DemoType } from 'csdm/common/types/counter-strike';
export function DemoTypesFilter({ selectedTypes, onChange, hasActiveFilter }) {
    const { t } = useLingui();
    const options = [
        {
            type: DemoType.GOTV,
            name: t({
                context: 'Demo type',
                message: 'GOTV',
            }),
        },
        {
            type: DemoType.POV,
            name: t({
                context: 'Demo type',
                message: 'POV',
            }),
        },
    ];
    const onSelectAllClick = () => {
        const values = options.map((option) => option.type);
        onChange(values);
    };
    const onDeselectAllClick = () => {
        onChange([]);
    };
    return (React.createElement(FilterCategory, { name: React.createElement(Trans, { context: "Demo type filter label" }, "Demo types"), right: React.createElement(FilterSelection, { onSelectAllClick: onSelectAllClick, onDeselectAllClick: onDeselectAllClick, hasActiveFilter: hasActiveFilter }) }, options.map((option) => {
        const isSelected = selectedTypes.includes(option.type);
        const onClick = () => {
            const newSelectedTypes = isSelected
                ? selectedTypes.filter((type) => type !== option.type)
                : [...selectedTypes, option.type];
            onChange(newSelectedTypes);
        };
        return (React.createElement(FilterValue, { key: option.type, isSelected: isSelected, onClick: onClick },
            React.createElement("span", null, option.name)));
    })));
}
//# sourceMappingURL=demo-types-filter.js.map