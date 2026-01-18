import React from 'react';
import { useAnalyses } from 'csdm/ui/analyses/use-analyses';
import { NumberBadge } from '../components/number-badge';
import { LeftBarBadge } from './left-bar-badge';
import { isAnalysisDoneStatus } from '../analyses/analysis-status';
export function PendingAnalysesBadge() {
    const analyses = useAnalyses();
    const analysesNotDone = analyses.filter((analysis) => {
        return isAnalysisDoneStatus(analysis.status);
    });
    return (React.createElement(LeftBarBadge, null,
        React.createElement(NumberBadge, { number: analysesNotDone.length })));
}
//# sourceMappingURL=pending-analyses-badge.js.map