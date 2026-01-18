import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Panel, PanelTitle, PanelValue, PanelValueVariant } from 'csdm/ui/components/panel';
import { roundNumber } from 'csdm/common/math/round-number';
export function KastPanel({ kast }) {
    return (React.createElement(Panel, { fitHeight: true, header: React.createElement(React.Fragment, null,
            React.createElement(PanelTitle, null,
                React.createElement(Trans, { context: "Panel title" }, "KAST")),
            React.createElement(PanelValue, { variant: PanelValueVariant.Big }, `${roundNumber(kast, 1)}%`)) }));
}
//# sourceMappingURL=kast-panel.js.map