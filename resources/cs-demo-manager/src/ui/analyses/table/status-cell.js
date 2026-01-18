import React from 'react';
import { Trans } from '@lingui/react/macro';
import { AnalysisStatus } from 'csdm/common/types/analysis-status';
export function StatusCell({ data }) {
    const { status } = data;
    switch (status) {
        case AnalysisStatus.Analyzing:
            return React.createElement(Trans, { context: "Analysis status" }, "Analyzing");
        case AnalysisStatus.AnalyzeError:
        case AnalysisStatus.InsertError:
            return React.createElement(Trans, { context: "Analysis status" }, "Error");
        case AnalysisStatus.AnalyzeSuccess:
        case AnalysisStatus.Inserting:
            return React.createElement(Trans, { context: "Analysis status" }, "Inserting");
        case AnalysisStatus.InsertSuccess:
            return React.createElement(Trans, { context: "Analysis status" }, "Done");
        default:
            return React.createElement(Trans, { context: "Analysis status" }, "Pending");
    }
}
//# sourceMappingURL=status-cell.js.map