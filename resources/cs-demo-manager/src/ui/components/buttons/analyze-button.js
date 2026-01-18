import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Button } from './button';
import { useProcessDemosToAnalyze } from 'csdm/ui/hooks/use-process-demos-to-analyze';
import { useIsDemoAnalysisInProgress } from 'csdm/ui/analyses/use-is-demo-analysis-in-progress';
export function AnalyzeButton({ demos, isDisabled }) {
    const processDemosToAnalyze = useProcessDemosToAnalyze();
    const isDemoAnalysisInProgress = useIsDemoAnalysisInProgress();
    if (demos.length === 0) {
        return null;
    }
    const onClick = () => {
        processDemosToAnalyze(demos);
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(Button, { onClick: onClick, isDisabled: isDisabled ?? isDemoAnalysisInProgress(demos[0].checksum) },
            React.createElement(Trans, { context: "Button" }, "Analyze"))));
}
//# sourceMappingURL=analyze-button.js.map