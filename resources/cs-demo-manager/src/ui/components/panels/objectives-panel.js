import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Panel, PanelRow, PanelTitle, PanelValue } from 'csdm/ui/components/panel';
export function ObjectivesPanel({ bombDefusedCount, bombPlantedCount, hostageRescuedCount }) {
    return (React.createElement(Panel, { header: React.createElement(PanelTitle, null,
            React.createElement(Trans, { context: "Panel title" }, "Objectives")), minWidth: 200 },
        React.createElement(PanelRow, null,
            React.createElement("p", null,
                React.createElement(Trans, { context: "Panel label" }, "Bomb planted")),
            React.createElement(PanelValue, null, bombPlantedCount)),
        React.createElement(PanelRow, null,
            React.createElement("p", null,
                React.createElement(Trans, { context: "Panel label" }, "Bomb defused")),
            React.createElement(PanelValue, null, bombDefusedCount)),
        React.createElement(PanelRow, null,
            React.createElement("p", null,
                React.createElement(Trans, { context: "Panel label" }, "Hostage rescued")),
            React.createElement(PanelValue, null, hostageRescuedCount))));
}
//# sourceMappingURL=objectives-panel.js.map