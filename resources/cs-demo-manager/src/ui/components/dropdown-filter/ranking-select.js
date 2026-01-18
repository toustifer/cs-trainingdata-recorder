import React from 'react';
import { Trans } from '@lingui/react/macro';
import { RankingFilter } from 'csdm/common/types/ranking-filter';
import { Select } from '../inputs/select';
import { ActiveFilterIndicator } from './active-filter-indicator';
export function RankingSelect({ selectedRanking, onChange }) {
    const options = [
        {
            value: RankingFilter.All,
            label: React.createElement(Trans, { context: "Option label for ranking filter" }, "All"),
        },
        {
            value: RankingFilter.Ranked,
            label: React.createElement(Trans, { context: "Option label for ranking filter" }, "Ranked"),
        },
        {
            value: RankingFilter.Unranked,
            label: React.createElement(Trans, { context: "Option label for ranking filter" }, "Unranked"),
        },
    ];
    const hasActiveFilter = selectedRanking !== RankingFilter.All;
    return (React.createElement("div", { className: "flex flex-col gap-y-8" },
        React.createElement("div", { className: "flex items-center justify-between" },
            React.createElement("p", null,
                React.createElement(Trans, { context: "Ranking filter label" }, "Ranking")),
            hasActiveFilter && React.createElement(ActiveFilterIndicator, null)),
        React.createElement("div", null,
            React.createElement(Select, { options: options, value: selectedRanking, onChange: onChange }))));
}
//# sourceMappingURL=ranking-select.js.map