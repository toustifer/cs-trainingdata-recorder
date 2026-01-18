// Translation is not possible here as the locale provider is under the error boundary.
/* eslint-disable lingui/no-unlocalized-strings */
import React, { useEffect } from 'react';
import { useRouteError } from 'react-router';
import { Button, ButtonVariant } from './components/buttons/button';
import { makeElementNonInert } from './shared/inert';
import { APP_ELEMENT_ID } from './shared/element-ids';
export function ErrorBoundary() {
    const error = useRouteError();
    const errorData = error instanceof Error ? (error.stack ?? error.message) : JSON.stringify(error);
    useEffect(() => {
        makeElementNonInert(APP_ELEMENT_ID);
    }, []);
    const buildIssueUrl = () => {
        const info = window.csdm.getAppInformation();
        const system = [
            `Version: ${APP_VERSION}`,
            `OS: ${info.platform} ${info.arch} ${info.osVersion}`,
            `Electron: ${info.electronVersion}`,
            `Chrome: ${info.chromeVersion}`,
        ];
        const title = 'Runtime error';
        const environment = system.join('\n');
        const stacktrace = `\`\`\`\n${errorData}\n\`\`\``;
        const url = new URL('https://github.com/akiver/cs-demo-manager/issues/new');
        url.searchParams.set('template', 'bug_report.yml');
        url.searchParams.set('title', title);
        url.searchParams.set('environment', environment);
        url.searchParams.set('additional', stacktrace);
        return url.toString();
    };
    return (React.createElement("div", { className: "flex size-full flex-col items-center" },
        React.createElement("div", { className: "h-48 w-full drag" }),
        React.createElement("div", { className: "flex w-full flex-col gap-y-12 p-24" },
            React.createElement("h1", { className: "text-title" }, "A runtime error occurred"),
            React.createElement("div", null,
                React.createElement("p", null, "Oops! Something went wrong."),
                React.createElement("p", null, "Please click the button below and follow the instructions on GitHub to report the problem."),
                React.createElement("p", null, "This will help us to fix the issue.")),
            React.createElement("div", { className: "flex w-full flex-col gap-y-16" },
                React.createElement("div", { className: "flex items-center gap-x-8" },
                    React.createElement(Button, { variant: ButtonVariant.Primary, onClick: () => {
                            window.open(buildIssueUrl());
                        } }, "Start submitting an issue on GitHub"),
                    React.createElement(Button, { onClick: () => {
                            navigator.clipboard.writeText(errorData);
                        } }, "Copy error"),
                    React.createElement(Button, { onClick: () => {
                            window.csdm.browseToFile(logger.getLogFilePath());
                        } }, "Reveal log file"),
                    React.createElement(Button, { onClick: async () => {
                            try {
                                await window.csdm.resetSettings();
                            }
                            catch (error) {
                                logger.error(error);
                            }
                        } }, "Reset settings"),
                    React.createElement(Button, { onClick: () => {
                            window.csdm.restartApp();
                        } }, "Restart the application")),
                React.createElement("div", null,
                    React.createElement("h2", { className: "text-subtitle" }, "Error"),
                    React.createElement("div", { className: "max-h-[600px] overflow-auto rounded-8 bg-gray-100" },
                        React.createElement("pre", { className: "p-8 select-text" }, errorData)))))));
}
//# sourceMappingURL=error-boundary.js.map