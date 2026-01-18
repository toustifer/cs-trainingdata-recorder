import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { OpeningDuelResult } from 'csdm/common/types/opening-duel-result';
import { FilterValue } from 'csdm/ui/components/dropdown-filter/filter-value';
export function OpeningDuelResultSelect({ onChange, selectedResult }) {
    const { t } = useLingui();
    const results = [
        {
            value: OpeningDuelResult.Won,
            label: t({
                context: 'Opening duel result select option',
                message: 'Won',
            }),
        },
        {
            value: OpeningDuelResult.Lost,
            label: t({
                context: 'Opening duel result select option',
                message: 'Lost',
            }),
        },
    ];
    return (React.createElement("div", { className: "flex flex-col gap-y-8" },
        React.createElement("p", null,
            React.createElement(Trans, { context: "Opening duel result filter category" }, "Opening duel result")),
        React.createElement("div", { className: "flex flex-wrap gap-4" }, results.map((result) => {
            const isSelected = selectedResult === result.value;
            return (React.createElement(FilterValue, { key: result.value, isSelected: isSelected, onClick: () => {
                    onChange(isSelected ? undefined : result.value);
                } }, result.label));
        }))));
}
//# sourceMappingURL=opening-duel-result-select.js.map