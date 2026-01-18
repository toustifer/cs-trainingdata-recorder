import React from 'react';
import { Trans } from '@lingui/react/macro';
import { FilterSelection } from '../../dropdown-filter/filter-selection';
import { FilterValue } from '../../dropdown-filter/filter-value';
export function RoundsSelect({ rounds, onChange, selectedRoundNumbers }) {
    return (React.createElement("div", { className: "flex flex-col gap-y-8" },
        React.createElement("div", { className: "flex items-baseline justify-between" },
            React.createElement("p", null,
                React.createElement(Trans, { context: "Filter rounds category" }, "Rounds")),
            React.createElement("div", { className: "mt-px ml-16" },
                React.createElement(FilterSelection, { onSelectAllClick: () => {
                        onChange(rounds.map((round) => round.number));
                    }, onDeselectAllClick: () => {
                        onChange([]);
                    } }))),
        React.createElement("div", { className: "flex flex-wrap gap-4" }, rounds.map((round) => {
            const isSelected = selectedRoundNumbers.includes(round.number);
            return (React.createElement(FilterValue, { key: round.number, isSelected: isSelected, onClick: () => {
                    onChange(isSelected
                        ? selectedRoundNumbers.filter((roundNumber) => roundNumber !== round.number)
                        : [...selectedRoundNumbers, round.number]);
                } }, round.number));
        }))));
}
//# sourceMappingURL=rounds-select.js.map