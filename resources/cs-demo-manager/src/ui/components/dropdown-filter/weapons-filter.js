import React from 'react';
import { Trans } from '@lingui/react/macro';
import { FilterCategory } from 'csdm/ui/components/dropdown-filter/filter-category';
import { FilterValue } from 'csdm/ui/components/dropdown-filter/filter-value';
import { FilterSelection } from 'csdm/ui/components/dropdown-filter/filter-selection';
export function WeaponsFilter({ weapons, selectedWeapons, onChange, hasActiveFilter }) {
    const onSelectAllClick = () => {
        onChange(weapons);
    };
    const onDeselectAllClick = () => {
        onChange([]);
    };
    return (React.createElement(FilterCategory, { name: React.createElement(Trans, { context: "Weapons filter label" }, "Weapons"), right: React.createElement(FilterSelection, { hasActiveFilter: hasActiveFilter, onSelectAllClick: onSelectAllClick, onDeselectAllClick: onDeselectAllClick }) }, weapons.map((weapon) => {
        const isSelected = selectedWeapons.includes(weapon);
        const onClick = () => {
            const newSelectedSources = isSelected
                ? selectedWeapons.filter((weaponName) => weaponName !== weapon)
                : [...selectedWeapons, weapon];
            onChange(newSelectedSources);
        };
        return (React.createElement(FilterValue, { isSelected: isSelected, key: weapon, onClick: onClick },
            React.createElement("span", null, weapon)));
    })));
}
//# sourceMappingURL=weapons-filter.js.map