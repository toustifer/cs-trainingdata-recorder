import React from 'react';
import { Trans } from '@lingui/react/macro';
import { SeeMatchButton } from './see-match-button';
import { SupportedDemoSourcesPerGame } from 'csdm/ui/shared/supported-demo-sources';
import { ChangeDemosSourceDialog } from 'csdm/ui/components/dialogs/change-demos-source-dialog';
import { Button } from 'csdm/ui/components/buttons/button';
import { useIsDemoInDatabase } from './use-is-demo-in-database';
import { AnalyzeButton } from 'csdm/ui/components/buttons/analyze-button';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { useIsDemoAnalysisInProgress } from 'csdm/ui/analyses/use-is-demo-analysis-in-progress';
export function DemoMatchStatus({ demo }) {
    const { showDialog } = useDialog();
    const isDemoInDatabase = useIsDemoInDatabase();
    const isDemoAnalysisInProgress = useIsDemoAnalysisInProgress();
    if (!SupportedDemoSourcesPerGame[demo.game].includes(demo.source)) {
        return (React.createElement("div", { className: "flex flex-col" },
            React.createElement("p", null,
                React.createElement(Trans, null, "The source of this demo is not supported.")),
            React.createElement("div", { className: "mt-8 flex justify-center" },
                React.createElement(Button, { onClick: () => {
                        showDialog(React.createElement(ChangeDemosSourceDialog, { checksums: [demo.checksum], initialSource: demo.source }));
                    } },
                    React.createElement(Trans, { context: "Button" }, "Change source")))));
    }
    const renderDemoMatchStatus = () => {
        if (isDemoAnalysisInProgress(demo.checksum)) {
            return (React.createElement("p", null,
                React.createElement(Trans, null, "Demo analysis in progress.")));
        }
        if (isDemoInDatabase(demo.checksum)) {
            return (React.createElement("div", { className: "flex flex-col" },
                React.createElement("p", null,
                    React.createElement(Trans, null, "This demo has been analyzed.")),
                React.createElement("div", { className: "mt-8 flex justify-center" },
                    React.createElement(SeeMatchButton, null))));
        }
        return (React.createElement("div", { className: "flex flex-col" },
            React.createElement("p", null,
                React.createElement(Trans, null, "This demo has not been analyzed yet.")),
            React.createElement("div", { className: "mt-8 flex justify-center" },
                React.createElement(AnalyzeButton, { demos: [demo] }))));
    };
    return React.createElement("div", { className: "flex h-full flex-col items-center justify-center" }, renderDemoMatchStatus());
}
//# sourceMappingURL=demo-match-status.js.map