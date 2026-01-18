import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Panel, PanelTitle, PanelValue, PanelValueVariant } from 'csdm/ui/components/panel';
import { roundNumber } from 'csdm/common/math/round-number';
export function HltvRating2Panel({ hltvRating2 }) {
    return (React.createElement(Panel, { fitHeight: true, header: React.createElement(React.Fragment, null,
            React.createElement(PanelTitle, null,
                React.createElement(Trans, { context: "Panel title" }, "HLTV 2.0")),
            React.createElement(PanelValue, { variant: PanelValueVariant.Big }, roundNumber(hltvRating2, 2))) }));
}
//# sourceMappingURL=hltv-rating-2-panel.js.map