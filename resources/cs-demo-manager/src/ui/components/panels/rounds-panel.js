import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Panel, PanelRow, PanelTitle, PanelValue } from 'csdm/ui/components/panel';
export function RoundsPanel({ roundCount, roundCountAsCt, roundCountAsT }) {
    return (React.createElement(Panel, { header: React.createElement(PanelTitle, null,
            React.createElement(Trans, { context: "Panel title" }, "Rounds")) },
        React.createElement(PanelRow, null,
            React.createElement("p", null,
                React.createElement(Trans, { context: "Panel label" }, "Total")),
            React.createElement(PanelValue, null, roundCount.toLocaleString())),
        React.createElement(PanelRow, null,
            React.createElement("p", null,
                React.createElement(Trans, { context: "Panel label" }, "CT")),
            React.createElement(PanelValue, null, roundCountAsCt.toLocaleString())),
        React.createElement(PanelRow, null,
            React.createElement("p", null,
                React.createElement(Trans, { context: "Panel label" }, "T")),
            React.createElement(PanelValue, null, roundCountAsT.toLocaleString()))));
}
//# sourceMappingURL=rounds-panel.js.map