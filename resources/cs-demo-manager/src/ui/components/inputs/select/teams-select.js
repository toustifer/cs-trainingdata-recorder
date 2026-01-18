import React from 'react';
import { Trans } from '@lingui/react/macro';
import { FilterValue } from 'csdm/ui/components/dropdown-filter/filter-value';
import { uniqueArray } from 'csdm/common/array/unique-array';
export function TeamsSelect({ teamNameA, teamNameB, onChange, selectedTeamNames }) {
    const teamNames = uniqueArray([teamNameA, teamNameB]);
    const options = teamNames.map((teamName) => {
        return {
            label: teamName,
            value: teamName,
        };
    });
    return (React.createElement("div", { className: "flex flex-col gap-y-8" },
        React.createElement("p", null,
            React.createElement(Trans, { context: "Filter teams name category" }, "Teams")),
        React.createElement("div", { className: "flex flex-wrap gap-4" }, options.map((team) => {
            const isSelected = selectedTeamNames.includes(team.value);
            return (React.createElement(FilterValue, { isSelected: isSelected, onClick: () => {
                    onChange(isSelected ? undefined : team.value);
                }, key: team.value }, team.label));
        }))));
}
//# sourceMappingURL=teams-select.js.map