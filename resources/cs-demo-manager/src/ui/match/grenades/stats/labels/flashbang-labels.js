import React from 'react';
import { Trans } from '@lingui/react/macro';
import { StatLabel } from 'csdm/ui/match/grenades/stats/labels/label';
export function FlashbangLabels() {
    return (React.createElement(React.Fragment, null,
        React.createElement(StatLabel, { text: React.createElement(Trans, null, "Duration") }),
        React.createElement(StatLabel, { text: React.createElement(Trans, null, "Players flashed") }),
        React.createElement(StatLabel, { text: React.createElement(Trans, null, "Player flashed per throw") }),
        React.createElement(StatLabel, { text: React.createElement(Trans, null, "Average player flashed per round") })));
}
//# sourceMappingURL=flashbang-labels.js.map