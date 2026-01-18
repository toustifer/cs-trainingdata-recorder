import React from 'react';
import clsx from 'clsx';
import { Trans } from '@lingui/react/macro';
import { roundNumberPercentage } from 'csdm/common/math/round-number-percentage';
import { Panel, PanelRow, PanelTitle, PanelValue, PanelValueVariant } from 'csdm/ui/components/panel';
function Circle({ className }) {
    return React.createElement("div", { className: clsx('mr-4 size-12 rounded-full', className) });
}
export function WinRatePanel({ matchCount, wonMatchCount, lostMatchCount, tiedMatchCount }) {
    const winRatePercent = matchCount > 0 ? roundNumberPercentage(wonMatchCount / matchCount) : 0;
    return (React.createElement(Panel, { header: React.createElement(React.Fragment, null,
            React.createElement(PanelTitle, null,
                React.createElement(Trans, { context: "Panel title" }, "Win ratio")),
            React.createElement(PanelValue, { variant: PanelValueVariant.Big }, `${winRatePercent}%`)) },
        React.createElement(PanelRow, null,
            React.createElement("p", null,
                React.createElement(Trans, { context: "Panel label" }, "Matches played")),
            React.createElement(PanelValue, null, matchCount)),
        React.createElement(PanelRow, null,
            React.createElement("div", { className: "flex items-center" },
                React.createElement(Circle, { className: "bg-green-700" }),
                React.createElement("p", null,
                    React.createElement(Trans, { context: "Panel label" }, "Wins"))),
            React.createElement(PanelValue, null, wonMatchCount)),
        React.createElement(PanelRow, null,
            React.createElement("div", { className: "flex items-center" },
                React.createElement(Circle, { className: "bg-blue-700" }),
                React.createElement("p", null,
                    React.createElement(Trans, { context: "Panel label" }, "Ties"))),
            React.createElement(PanelValue, null, tiedMatchCount)),
        React.createElement(PanelRow, null,
            React.createElement("div", { className: "flex items-center" },
                React.createElement(Circle, { className: "bg-red-700" }),
                React.createElement("p", null,
                    React.createElement(Trans, { context: "Panel label" }, "Defeats"))),
            React.createElement(PanelValue, null, lostMatchCount))));
}
//# sourceMappingURL=win-rate-panel.js.map