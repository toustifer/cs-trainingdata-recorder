import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Panel, PanelRow, PanelTitle, PanelValue } from 'csdm/ui/components/panel';
export function UtilitiesPanel({ decoyThrownCount, flashbangThrownCount, heGrenadeThrownCount, incendiaryThrownCount, molotovThrownCount, smokeThrownCount, }) {
    return (React.createElement(Panel, { header: React.createElement(PanelTitle, null,
            React.createElement(Trans, { context: "Panel title" }, "Utilities")) },
        React.createElement(PanelRow, null,
            React.createElement("p", null,
                React.createElement(Trans, { context: "Panel label" }, "HE grenades")),
            React.createElement(PanelValue, null, heGrenadeThrownCount)),
        React.createElement(PanelRow, null,
            React.createElement("p", null,
                React.createElement(Trans, { context: "Panel label" }, "Flashbangs")),
            React.createElement(PanelValue, null, flashbangThrownCount)),
        React.createElement(PanelRow, null,
            React.createElement("p", null,
                React.createElement(Trans, { context: "Panel label" }, "Smokes")),
            React.createElement(PanelValue, null, smokeThrownCount)),
        React.createElement(PanelRow, null,
            React.createElement("p", null,
                React.createElement(Trans, { context: "Panel label" }, "Molotovs")),
            React.createElement(PanelValue, null, molotovThrownCount)),
        React.createElement(PanelRow, null,
            React.createElement("p", null,
                React.createElement(Trans, { context: "Panel label" }, "Incendiaries")),
            React.createElement(PanelValue, null, incendiaryThrownCount)),
        React.createElement(PanelRow, null,
            React.createElement("p", null,
                React.createElement(Trans, { context: "Panel label" }, "Decoys")),
            React.createElement(PanelValue, null, decoyThrownCount))));
}
//# sourceMappingURL=utilities-panel.js.map