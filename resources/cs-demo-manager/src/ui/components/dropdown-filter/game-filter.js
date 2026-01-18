import React from 'react';
import { Trans } from '@lingui/react/macro';
import { FilterCategory } from 'csdm/ui/components/dropdown-filter/filter-category';
import { FilterValue } from 'csdm/ui/components/dropdown-filter/filter-value';
import { FilterSelection } from './filter-selection';
import { useGameOptions } from 'csdm/ui/hooks/use-game-options';
export function GameFilter({ selectedGames, onChange, hasActiveFilter }) {
    const options = useGameOptions();
    const onSelectAllClick = () => {
        const values = options.map((option) => option.value);
        onChange(values);
    };
    const onDeselectAllClick = () => {
        onChange([]);
    };
    return (React.createElement(FilterCategory, { name: React.createElement(Trans, { context: "Games filter label" }, "Games"), right: React.createElement(FilterSelection, { onSelectAllClick: onSelectAllClick, onDeselectAllClick: onDeselectAllClick, hasActiveFilter: hasActiveFilter }) }, options.map((option) => {
        const isSelected = selectedGames.includes(option.value);
        const onClick = () => {
            const newSelectedGames = isSelected
                ? selectedGames.filter((game) => game !== option.value)
                : [...selectedGames, option.value];
            onChange(newSelectedGames);
        };
        return (React.createElement(FilterValue, { key: option.value, isSelected: isSelected, onClick: onClick },
            React.createElement("span", null, option.label)));
    })));
}
//# sourceMappingURL=game-filter.js.map