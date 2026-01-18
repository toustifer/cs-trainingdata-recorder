import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Spinner } from 'csdm/ui/components/spinner';
import { Tooltip } from 'csdm/ui/components/tooltip';
import { AnalysisStatus } from 'csdm/common/types/analysis-status';
import { TimesCircleIcon } from 'csdm/ui/icons/times-circle';
import { useGetDemoAnalysisStatus } from 'csdm/ui/analyses/use-get-demo-analysis-status';
import { ExclamationTriangleIcon } from 'csdm/ui/icons/exclamation-triangle-icon';
import { CheckCircleIcon } from 'csdm/ui/icons/check-circle-icon';
import { ClockIcon } from 'csdm/ui/icons/clock-icon';
function getAnalysisStatusTooltipText(status) {
    switch (status) {
        case AnalysisStatus.Pending:
            return React.createElement(Trans, null, "Pending analysis\u2026");
        case AnalysisStatus.Analyzing:
            return React.createElement(Trans, null, "Analyzing\u2026");
        case AnalysisStatus.AnalyzeError:
            return React.createElement(Trans, null, "Analyze error");
        case AnalysisStatus.InsertError:
            return React.createElement(Trans, null, "Insertion error");
        case AnalysisStatus.AnalyzeSuccess:
        case AnalysisStatus.Inserting:
            return React.createElement(Trans, null, "Inserting into database\u2026");
        case AnalysisStatus.InsertSuccess:
            return React.createElement(Trans, null, "In database");
        default:
            return React.createElement(Trans, null, "Not in database");
    }
}
export function DemoStatusCell({ data: demo }) {
    const getDemoAnalysisStatus = useGetDemoAnalysisStatus();
    const status = getDemoAnalysisStatus(demo.checksum);
    const tooltipText = getAnalysisStatusTooltipText(status);
    let icon;
    switch (status) {
        case AnalysisStatus.Pending:
            icon = React.createElement(ClockIcon, { className: "fill-blue-700" });
            break;
        case AnalysisStatus.AnalyzeError:
        case AnalysisStatus.InsertError:
            icon = React.createElement(ExclamationTriangleIcon, { className: "fill-red-400" });
            break;
        case AnalysisStatus.InsertSuccess:
            icon = React.createElement(CheckCircleIcon, { className: "fill-green-400" });
            break;
        case AnalysisStatus.Inserting:
        case AnalysisStatus.Analyzing:
        case AnalysisStatus.AnalyzeSuccess:
            icon = React.createElement(Spinner, { size: 18 });
            break;
        default:
            icon = React.createElement(TimesCircleIcon, { className: "fill-orange-400" });
    }
    return (React.createElement(Tooltip, { content: tooltipText },
        React.createElement("div", null, icon)));
}
//# sourceMappingURL=demo-status-cell.js.map