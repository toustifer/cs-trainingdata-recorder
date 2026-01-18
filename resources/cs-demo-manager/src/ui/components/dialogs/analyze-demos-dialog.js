import React, { useState } from 'react';
import { Trans, Plural } from '@lingui/react/macro';
import { ConfirmDialog } from 'csdm/ui/dialogs/confirm-dialog';
import { Checkbox } from '../inputs/checkbox';
import { useAddDemosToAnalyses } from 'csdm/ui/hooks/use-add-demos-to-analyses';
import { ExternalLink } from '../external-link';
export function AnalyzeConfirmationDialog({ analyzableDemos, demosAlreadyInDatabase, demosAnalysesInProgressCount, demosSourceNotSupportedCount, }) {
    const addDemosToAnalyses = useAddDemosToAnalyses();
    const [shouldReanalyzeDemos, setShouldReanalyzeDemos] = useState(false);
    const demosToAnalyze = [...analyzableDemos];
    if (shouldReanalyzeDemos) {
        demosToAnalyze.push(...demosAlreadyInDatabase);
    }
    const isConfirmButtonDisabled = demosToAnalyze.length === 0;
    const demoAlreadyInDatabaseCount = demosAlreadyInDatabase.length;
    const onConfirm = () => {
        addDemosToAnalyses(demosToAnalyze);
    };
    return (React.createElement(ConfirmDialog, { title: React.createElement(Trans, null, "Demo analysis"), onConfirm: onConfirm, isConfirmButtonDisabled: isConfirmButtonDisabled },
        React.createElement("ul", null,
            demosSourceNotSupportedCount > 0 && (React.createElement("li", null,
                React.createElement("p", null,
                    React.createElement(Plural, { value: demosSourceNotSupportedCount, one: "The demo's source is not supported", other: "# demos source are not supported" })),
                React.createElement("p", null,
                    React.createElement(Trans, null,
                        "Please see this",
                        ' ',
                        React.createElement(ExternalLink, { href: "https://cs-demo-manager.com/docs/guides/demos-analysis#the-demo-source-is-not-supported" }, "documentation"),
                        ' ',
                        "for details.")))),
            demosAnalysesInProgressCount > 0 && (React.createElement("li", null,
                React.createElement(Plural, { value: demosAnalysesInProgressCount, one: "The demo is already in pending analyses", other: "# demos are already in pending analyses" }))),
            demoAlreadyInDatabaseCount > 0 && (React.createElement("li", null,
                React.createElement(Plural, { value: demoAlreadyInDatabaseCount, one: "# demo is already in the database", other: "# demos are already in the database" })))),
        demoAlreadyInDatabaseCount > 0 && (React.createElement("div", { className: "my-4" },
            React.createElement(Checkbox, { label: React.createElement(Trans, { context: "Checkbox label" }, "Analyze demos already in database?"), isChecked: shouldReanalyzeDemos, onChange: (event) => {
                    setShouldReanalyzeDemos(event.target.checked);
                } }))),
        React.createElement("p", null,
            React.createElement(Plural, { value: demosToAnalyze.length, one: "# demo will be analyzed", other: "# demos will be analyzed" }))));
}
//# sourceMappingURL=analyze-demos-dialog.js.map