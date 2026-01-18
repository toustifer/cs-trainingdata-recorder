import React, { useState } from 'react';
import { XAxis } from 'csdm/ui/player/charts/x-axis';
import { Content } from 'csdm/ui/components/content';
import { HeadshotPercentageChart } from 'csdm/ui/player/charts/headshot-percentage-chart';
import { KillDeathRatioChart } from 'csdm/ui/player/charts/kill-death-ratio-chart';
import { AverageDamagePerRoundChart } from 'csdm/ui/player/charts/average-damage-per-round-chart';
import { ActionBar } from 'csdm/ui/components/action-bar';
import { CompetitiveRankRepartitionChart } from './competitive-rank-repartition-chart';
import { MatchCountChart } from './match-count-chart';
import { ClutchWonPercentageChart } from './clutch-won-percentage-chart';
import { PremierRankRepartitionChart } from './premier-rank-repartition-chart';
export function PlayerCharts() {
    const [axis, setAxisX] = useState('day');
    return (React.createElement(React.Fragment, null,
        React.createElement(ActionBar, { left: React.createElement(React.Fragment, null,
                React.createElement(XAxis, { selectedAxis: axis, onChange: (axis) => {
                        setAxisX(axis);
                    } })) }),
        React.createElement(Content, null,
            React.createElement("div", { className: "flex" },
                React.createElement(MatchCountChart, { axis: axis }),
                React.createElement(HeadshotPercentageChart, { axis: axis })),
            React.createElement("div", { className: "flex" },
                React.createElement(KillDeathRatioChart, { axis: axis }),
                React.createElement(AverageDamagePerRoundChart, { axis: axis })),
            React.createElement("div", { className: "flex" },
                React.createElement(ClutchWonPercentageChart, { axis: axis })),
            React.createElement("div", { className: "flex items-center gap-x-12" },
                React.createElement(CompetitiveRankRepartitionChart, null),
                React.createElement(PremierRankRepartitionChart, null)))));
}
//# sourceMappingURL=player-charts.js.map