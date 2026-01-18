import React from 'react';
import { Trans } from '@lingui/react/macro';
import { roundNumber } from 'csdm/common/math/round-number';
import { Panel, PanelRow, PanelTitle, PanelValue, PanelValueVariant } from 'csdm/ui/components/panel';
export function HeadshotPanel({ headshotPercentage, headshotCount, killCount, deathCount, assistCount }) {
    return (React.createElement(Panel, { header: React.createElement(React.Fragment, null,
            React.createElement(PanelTitle, null,
                React.createElement(Trans, { context: "Panel title" }, "HS %")),
            React.createElement(PanelValue, { variant: PanelValueVariant.Big }, `${roundNumber(headshotPercentage, 1)}%`)) },
        React.createElement(PanelRow, null,
            React.createElement("p", null,
                React.createElement(Trans, { context: "Panel label" }, "Kills")),
            React.createElement(PanelValue, null, killCount)),
        React.createElement(PanelRow, null,
            React.createElement("p", null,
                React.createElement(Trans, { context: "Panel label" }, "Deaths")),
            React.createElement(PanelValue, null, deathCount.toLocaleString())),
        React.createElement(PanelRow, null,
            React.createElement("p", null,
                React.createElement(Trans, { context: "Panel label" }, "Assists")),
            React.createElement(PanelValue, null, assistCount.toLocaleString())),
        React.createElement(PanelRow, null,
            React.createElement("p", null,
                React.createElement(Trans, { context: "Panel label" }, "Headshots")),
            React.createElement(PanelValue, null, headshotCount))));
}
//# sourceMappingURL=headshot-panel.js.map