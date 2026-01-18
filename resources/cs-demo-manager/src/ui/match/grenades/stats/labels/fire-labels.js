import React from 'react';
import { Trans } from '@lingui/react/macro';
import { StatLabel } from 'csdm/ui/match/grenades/stats/labels/label';
export function FireLabels() {
    return (React.createElement(React.Fragment, null,
        React.createElement(StatLabel, { text: React.createElement(Trans, null, "Damage") }),
        React.createElement(StatLabel, { text: React.createElement(Trans, null, "Damage per throw") }),
        React.createElement(StatLabel, { text: React.createElement(Trans, null, "Enemies damaged per throw") }),
        React.createElement(StatLabel, { text: React.createElement(Trans, null, "Average damage per round") })));
}
//# sourceMappingURL=fire-labels.js.map