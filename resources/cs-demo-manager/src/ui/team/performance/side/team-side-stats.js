import React from 'react';
import { Trans } from '@lingui/react/macro';
import { TeamSideMatchChart } from './team-side-match-stats';
import { TeamMatchResultCtChart } from './team-match-result-ct-chart';
import { TeamMatchResultTerroChart } from './team-match-result-terro-chart';
import { Section } from 'csdm/ui/components/section';
export function TeamSideStats() {
    return (React.createElement(Section, { title: React.createElement(Trans, { context: "Panel title" }, "Side") },
        React.createElement("div", { className: "flex flex-wrap gap-12" },
            React.createElement(TeamSideMatchChart, null),
            React.createElement(TeamMatchResultCtChart, null),
            React.createElement(TeamMatchResultTerroChart, null))));
}
//# sourceMappingURL=team-side-stats.js.map