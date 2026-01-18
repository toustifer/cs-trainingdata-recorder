import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Panel, PanelRow, PanelTitle, PanelValue } from 'csdm/ui/components/panel';
export function KillsPanel({ collateralKillCount, wallbangKillCount }) {
    return (React.createElement(Panel, { header: React.createElement(PanelTitle, null,
            React.createElement(Trans, { context: "Panel title" }, "Kills")) },
        React.createElement(PanelRow, null,
            React.createElement("p", null,
                React.createElement(Trans, { context: "Panel label" }, "Wallbang kills")),
            React.createElement(PanelValue, null, wallbangKillCount.toLocaleString())),
        React.createElement(PanelRow, null,
            React.createElement("p", null,
                React.createElement(Trans, { context: "Panel label" }, "Collateral kills")),
            React.createElement(PanelValue, null, collateralKillCount.toLocaleString()))));
}
//# sourceMappingURL=kills-panel.js.map