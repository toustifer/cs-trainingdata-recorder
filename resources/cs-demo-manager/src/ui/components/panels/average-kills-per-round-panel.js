import React from 'react';
import { Trans } from '@lingui/react/macro';
import { roundNumber } from 'csdm/common/math/round-number';
import { Panel, PanelTitle, PanelValue, PanelValueVariant } from 'csdm/ui/components/panel';
export function AverageKillsPerRoundPanel({ averageKillsPerRound }) {
    return (React.createElement(Panel, { fitHeight: true, header: React.createElement(React.Fragment, null,
            React.createElement(PanelTitle, null,
                React.createElement(Trans, { context: "Panel title" }, "Average kills/round")),
            React.createElement(PanelValue, { variant: PanelValueVariant.Big }, roundNumber(averageKillsPerRound, 2))) }));
}
//# sourceMappingURL=average-kills-per-round-panel.js.map