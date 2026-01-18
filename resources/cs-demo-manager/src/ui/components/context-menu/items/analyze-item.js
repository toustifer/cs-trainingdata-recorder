import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
import { useProcessDemosToAnalyze } from 'csdm/ui/hooks/use-process-demos-to-analyze';
export function AnalyzeItem({ demos }) {
    const isDisabled = demos.length === 0;
    const processDemosToAnalyze = useProcessDemosToAnalyze();
    const onClick = () => {
        processDemosToAnalyze(demos);
    };
    return (React.createElement(ContextMenuItem, { onClick: onClick, isDisabled: isDisabled },
        React.createElement(Trans, { context: "Context menu" }, "Analyze")));
}
//# sourceMappingURL=analyze-item.js.map