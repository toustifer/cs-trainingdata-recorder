import React from 'react';
import clsx from 'clsx';
import { Trans, useLingui } from '@lingui/react/macro';
import { TeamNumber } from 'csdm/common/types/counter-strike';
import { FilterValue } from '../../dropdown-filter/filter-value';
export function SideSelect({ onChange, selectedSides, direction = 'vertical' }) {
    const { t } = useLingui();
    const sides = [
        {
            value: TeamNumber.CT,
            label: t({
                context: 'Select team option',
                message: 'CT',
            }),
        },
        {
            value: TeamNumber.T,
            label: t({
                context: 'Select team option',
                message: 'T',
            }),
        },
    ];
    return (React.createElement("div", { className: clsx('flex gap-8', direction === 'vertical' ? 'flex-col' : 'flex-row') },
        React.createElement("p", null,
            React.createElement(Trans, { context: "Filter side category" }, "Side")),
        React.createElement("div", { className: "flex flex-wrap gap-4" }, sides.map((side) => {
            const isSelected = selectedSides.includes(side.value);
            return (React.createElement(FilterValue, { key: side.value, isSelected: isSelected, onClick: () => {
                    onChange(isSelected ? undefined : side.value);
                } }, side.label));
        }))));
}
//# sourceMappingURL=side-select.js.map