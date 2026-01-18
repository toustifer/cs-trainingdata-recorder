import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Panel, PanelRow, PanelTitle, PanelValue } from 'csdm/ui/components/panel';
export function MultiKillsPanel({ oneKillCount, twoKillCount, threeKillCount, fourKillCount, fiveKillCount }) {
    return (React.createElement(Panel, { header: React.createElement(PanelTitle, null,
            React.createElement(Trans, { context: "Panel title" }, "Multi kills")) },
        React.createElement(PanelRow, null,
            React.createElement("p", null,
                React.createElement(Trans, { context: "Panel label" }, "5K")),
            React.createElement(PanelValue, null, fiveKillCount)),
        React.createElement(PanelRow, null,
            React.createElement("p", null,
                React.createElement(Trans, { context: "Panel label" }, "4K")),
            React.createElement(PanelValue, null, fourKillCount)),
        React.createElement(PanelRow, null,
            React.createElement("p", null,
                React.createElement(Trans, { context: "Panel label" }, "3K")),
            React.createElement(PanelValue, null, threeKillCount)),
        React.createElement(PanelRow, null,
            React.createElement("p", null,
                React.createElement(Trans, { context: "Panel label" }, "2K")),
            React.createElement(PanelValue, null, twoKillCount)),
        React.createElement(PanelRow, null,
            React.createElement("p", null,
                React.createElement(Trans, { context: "Panel label" }, "1K")),
            React.createElement(PanelValue, null, oneKillCount))));
}
//# sourceMappingURL=multi-kills-panel.js.map