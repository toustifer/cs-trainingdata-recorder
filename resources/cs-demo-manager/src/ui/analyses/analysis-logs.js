import React, {} from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { AnalysisStatus } from 'csdm/common/types/analysis-status';
import { useSelectedAnalysis } from './use-selected-analysis-demo-id';
import { assertNever } from 'csdm/common/assert-never';
import { isAnalysisErrorStatus } from './analysis-status';
import { CopyButton } from 'csdm/ui/components/buttons/copy-button';
import { ExternalLink } from 'csdm/ui/components/external-link';
import { ExclamationTriangleIcon } from 'csdm/ui/icons/exclamation-triangle-icon';
import { isErrorCode } from 'csdm/common/is-error-code';
import { ErrorCode } from 'csdm/common/error-code';
function useGenerateLogs() {
    const { t } = useLingui();
    return (analysis) => {
        const logs = [
            t({
                context: 'Analysis status',
                message: 'Pending analysis…',
            }),
        ];
        const analyzingMessage = t({
            context: 'Analysis status',
            message: 'Analyzing demo…',
        });
        const analyzeErrorMessage = t({
            context: 'Analysis status',
            message: 'An error occurred while analyzing the demo.',
        });
        const analyzeSuccessMessage = t({
            context: 'Analysis status',
            message: 'Analysis succeed.',
        });
        const insertingMessage = t({
            context: 'Analysis status',
            message: 'Inserting match…',
        });
        switch (analysis.status) {
            case AnalysisStatus.Pending:
                return logs;
            case AnalysisStatus.Analyzing:
                logs.push(analyzingMessage);
                break;
            case AnalysisStatus.AnalyzeError:
                logs.push(analyzingMessage, analyzeErrorMessage);
                break;
            case AnalysisStatus.AnalyzeSuccess:
                logs.push(analyzingMessage, analyzeSuccessMessage);
                break;
            case AnalysisStatus.Inserting:
                logs.push(analyzingMessage, analyzeSuccessMessage, insertingMessage);
                break;
            case AnalysisStatus.InsertSuccess:
                logs.push(analyzingMessage, analyzeSuccessMessage, insertingMessage, t({
                    context: 'Analysis status',
                    message: 'Match inserted into the database.',
                }));
                break;
            case AnalysisStatus.InsertError:
                logs.push(analyzingMessage, analyzeSuccessMessage, insertingMessage, t({
                    context: 'Analysis status',
                    message: 'An error occurred while inserting the match into the database.',
                }));
                break;
            default:
                assertNever(analysis.status, `Unsupported analysis status: ${analysis.status}`);
        }
        return logs;
    };
}
export function AnalysisLogs() {
    const selectedAnalysis = useSelectedAnalysis();
    const generateLogs = useGenerateLogs();
    if (selectedAnalysis === undefined) {
        return null;
    }
    const logs = generateLogs(selectedAnalysis);
    const renderError = () => {
        let message;
        if (isErrorCode(selectedAnalysis.errorCode)) {
            const errorCodeMapping = {
                [ErrorCode.InsertMatchDuplicatedChecksum]: 'INSERT_MATCH_DUPLICATED_CHECKSUM',
                [ErrorCode.InsertRoundsError]: 'INSERT_ROUNDS_ERROR',
            };
            const errorCode = errorCodeMapping[selectedAnalysis.errorCode] ?? 'UNKNOWN';
            message = (React.createElement("div", null,
                React.createElement("p", null,
                    React.createElement(Trans, null,
                        "The analysis failed with the error code: ",
                        React.createElement("strong", { className: "selectable" }, errorCode))),
                React.createElement("p", null,
                    React.createElement(Trans, null,
                        "Please read the error codes",
                        ' ',
                        React.createElement(ExternalLink, { href: "https://cs-demo-manager.com/docs/guides/demos-analysis#analysis-errors" }, "documentation"),
                        ' ',
                        "to understand the code signification and what you can do.")),
                React.createElement("p", null,
                    React.createElement(Trans, null,
                        "Please read and follow the instructions on",
                        ' ',
                        React.createElement(ExternalLink, { href: "https://github.com/akiver/cs-demo-manager/issues/new?assignees=&labels=&projects=&template=bug_report.yml" }, "GitHub"),
                        ' ',
                        "to report the issue ",
                        React.createElement("strong", null, "only if the documentation says you should for this error code"),
                        "."))));
        }
        else {
            message = (React.createElement("p", null,
                React.createElement(Trans, null,
                    "Please read and follow the instructions on",
                    ' ',
                    React.createElement(ExternalLink, { href: "https://github.com/akiver/cs-demo-manager/issues/new?assignees=&labels=&projects=&template=bug_report.yml" }, "GitHub"),
                    ' ',
                    "to report the issue.")));
        }
        return (React.createElement("div", { className: "flex items-center gap-x-8 py-8" },
            React.createElement(ExclamationTriangleIcon, { className: "size-24 text-red-700" }),
            message));
    };
    return (React.createElement("div", { className: "mt-auto h-[420px] w-full overflow-y-auto border-t border-t-gray-300 p-16" },
        React.createElement("div", { className: "flex flex-col justify-end" },
            logs.map((log, index) => {
                return React.createElement("p", { key: `${log}${index}` }, log);
            }),
            isAnalysisErrorStatus(selectedAnalysis.status) && renderError()),
        selectedAnalysis.output && (React.createElement("div", { className: "mt-12 flex w-full flex-col gap-y-4" },
            React.createElement("div", { className: "flex items-center gap-x-8" },
                React.createElement("p", { className: "text-body-strong" },
                    React.createElement(Trans, null, "Logs:")),
                React.createElement(CopyButton, { data: selectedAnalysis.output })),
            React.createElement("div", { className: "max-h-[600px] overflow-auto rounded-8 bg-gray-100" },
                React.createElement("pre", { className: "p-8 select-text" }, selectedAnalysis.output))))));
}
//# sourceMappingURL=analysis-logs.js.map