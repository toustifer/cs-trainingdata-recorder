import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { FilterCategory } from 'csdm/ui/components/dropdown-filter/filter-category';
import { BanFilter } from 'csdm/common/types/ban-filter';
import { FilterValue } from 'csdm/ui/components/dropdown-filter/filter-value';
import { FilterSelection } from 'csdm/ui/components/dropdown-filter/filter-selection';
function useBanOptions() {
    const { t } = useLingui();
    return [
        {
            id: BanFilter.None,
            label: t({
                context: 'Select option Steam ban status',
                message: 'None',
            }),
        },
        {
            id: BanFilter.VacBanned,
            label: t({
                context: 'Select option Steam ban status',
                message: 'VAC banned',
            }),
        },
        {
            id: BanFilter.GameBanned,
            label: t({
                context: 'Select option Steam ban status',
                message: 'Game banned',
            }),
        },
        {
            id: BanFilter.CommunityBanned,
            label: t({
                context: 'Select option Steam ban status',
                message: 'Community banned',
            }),
        },
    ];
}
export function BansFilter({ selectedBans, onChange, hasActiveFilter }) {
    const options = useBanOptions();
    const onSelectAllClick = () => {
        const ids = options.map((option) => option.id);
        onChange(ids);
    };
    const onDeselectAllClick = () => {
        onChange([]);
    };
    return (React.createElement(FilterCategory, { name: React.createElement(Trans, { context: "Ban filter title" }, "Bans"), right: React.createElement(FilterSelection, { onSelectAllClick: onSelectAllClick, onDeselectAllClick: onDeselectAllClick, hasActiveFilter: hasActiveFilter }) }, options.map((option) => {
        const isSelected = selectedBans.includes(option.id);
        const onClick = () => {
            const newSelectedBans = isSelected
                ? selectedBans.filter((id) => id !== option.id)
                : [...selectedBans, option.id];
            onChange(newSelectedBans);
        };
        return (React.createElement(FilterValue, { key: option.id, isSelected: isSelected, onClick: onClick },
            React.createElement("span", null, option.label)));
    })));
}
//# sourceMappingURL=ban-filter.js.map