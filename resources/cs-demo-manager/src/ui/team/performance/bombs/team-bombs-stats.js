import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Section } from 'csdm/ui/components/section';
import { TeamBombPlantChart } from './team-bomb-plant-chart';
import { TeamEnemyBombPlantRoundOutcomeChart, TeamBombPlantRoundOutcomeChart } from './team-bomb-round-outcome-chart';
export function TeamBombsStats() {
    return (React.createElement(Section, { title: React.createElement(Trans, { context: "Panel title" }, "Bombs") },
        React.createElement("div", { className: "flex flex-wrap gap-12" },
            React.createElement(TeamBombPlantChart, null),
            React.createElement(TeamBombPlantRoundOutcomeChart, null),
            React.createElement(TeamEnemyBombPlantRoundOutcomeChart, null))));
}
//# sourceMappingURL=team-bombs-stats.js.map