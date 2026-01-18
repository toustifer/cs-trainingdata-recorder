import React from 'react';
import { Trans } from '@lingui/react/macro';
import { AnalysisStatusFilter } from 'csdm/common/types/analysis-status-filter';
import { Select } from 'csdm/ui/components/inputs/select';
import { ActiveFilterIndicator } from './active-filter-indicator';
export function AnalysisStatusSelect({ selectedStatus, onChange }) {
    const options = [
        {
            value: AnalysisStatusFilter.All,
            label: React.createElement(Trans, { context: "Option label for demo analysis status" }, "All"),
        },
        {
            value: AnalysisStatusFilter.NotInDatabase,
            label: React.createElement(Trans, { context: "Option label for demo analysis status" }, "Not in database"),
        },
        {
            value: AnalysisStatusFilter.Pending,
            label: React.createElement(Trans, { context: "Option label for demo analysis status" }, "Pending"),
        },
        {
            value: AnalysisStatusFilter.InProgress,
            label: React.createElement(Trans, { context: "Option label for demo analysis status" }, "In progress"),
        },
        {
            value: AnalysisStatusFilter.InDatabase,
            label: React.createElement(Trans, { context: "Option label for demo analysis status" }, "In database"),
        },
        {
            value: AnalysisStatusFilter.Error,
            label: React.createElement(Trans, { context: "Option label for demo analysis status" }, "Error"),
        },
    ];
    const hasActiveFilter = selectedStatus !== AnalysisStatusFilter.All;
    return (React.createElement("div", { className: "flex flex-col gap-y-8" },
        React.createElement("div", { className: "flex items-center justify-between" },
            React.createElement("p", null,
                React.createElement(Trans, { context: "Demo analysis status" }, "Status")),
            hasActiveFilter && React.createElement(ActiveFilterIndicator, null)),
        React.createElement("div", null,
            React.createElement(Select, { options: options, value: selectedStatus, onChange: onChange }))));
}
//# sourceMappingURL=analysis-status-select.js.map