import React from 'react';
import { Trans } from '@lingui/react/macro';
import { AnalysisStatus } from 'csdm/common/types/analysis-status';
import { useSelectedAnalysis } from 'csdm/ui/analyses/use-selected-analysis-demo-id';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
import { useNavigateToMatch } from 'csdm/ui/hooks/use-navigate-to-match';
export function SeeMatchItem() {
    const selectedAnalysis = useSelectedAnalysis();
    const navigateToMatch = useNavigateToMatch();
    const onClick = () => {
        if (selectedAnalysis === undefined) {
            return;
        }
        navigateToMatch(selectedAnalysis.demoChecksum);
    };
    const isDisabled = selectedAnalysis === undefined || selectedAnalysis.status !== AnalysisStatus.InsertSuccess;
    return (React.createElement(ContextMenuItem, { onClick: onClick, isDisabled: isDisabled },
        React.createElement(Trans, { context: "Context menu" }, "See match")));
}
//# sourceMappingURL=see-match-item.js.map