import React from 'react';
import { Trans } from '@lingui/react/macro';
import { roundNumber } from 'csdm/common/math/round-number';
import { Panel, PanelTitle, PanelValue, PanelValueVariant } from 'csdm/ui/components/panel';
export function AverageDeathsPerRoundPanel({ averageDeathsPerRound }) {
    return (React.createElement(Panel, { fitHeight: true, header: React.createElement(React.Fragment, null,
            React.createElement(PanelTitle, null,
                React.createElement(Trans, { context: "Panel title" }, "Average deaths/round")),
            React.createElement(PanelValue, { variant: PanelValueVariant.Big }, roundNumber(averageDeathsPerRound, 2))) }));
}
//# sourceMappingURL=average-deaths-per-round-panel.js.map