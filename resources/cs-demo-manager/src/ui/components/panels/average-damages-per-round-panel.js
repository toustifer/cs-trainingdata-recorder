import React from 'react';
import { Trans } from '@lingui/react/macro';
import { roundNumber } from 'csdm/common/math/round-number';
import { Panel, PanelTitle, PanelValue, PanelValueVariant } from 'csdm/ui/components/panel';
export function AverageDamagesPerRoundPanel({ averageDamagePerRound }) {
    return (React.createElement(Panel, { fitHeight: true, header: React.createElement(React.Fragment, null,
            React.createElement(PanelTitle, null,
                React.createElement(Trans, { context: "Panel title" }, "ADR")),
            React.createElement(PanelValue, { variant: PanelValueVariant.Big }, roundNumber(averageDamagePerRound, 1))) }));
}
//# sourceMappingURL=average-damages-per-round-panel.js.map