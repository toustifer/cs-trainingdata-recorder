import React, {} from 'react';
import { Trans } from '@lingui/react/macro';
import { PanelStatRow } from 'csdm/ui/components/panel';
import { Section } from 'csdm/ui/components/section';
import { roundNumber } from 'csdm/common/math/round-number';
import { WinRate } from 'csdm/ui/components/panels/win-rate';
function ClutchPanel({ allClutches, title, opponentCount }) {
    const clutches = opponentCount > 0 ? allClutches.filter((clutch) => clutch.opponentCount === opponentCount) : allClutches;
    const wonCount = clutches.filter((clutch) => clutch.won).length;
    const lostClutches = clutches.filter((clutch) => !clutch.won);
    const lostCount = lostClutches.length;
    const winRate = roundNumber((wonCount / clutches.length) * 100, 1);
    const saveClutchCount = lostClutches.filter((clutch) => clutch.hasClutcherSurvived).length;
    const saveRate = roundNumber((saveClutchCount / lostCount) * 100, 1);
    const killCount = clutches.reduce((previousClutch, clutch) => previousClutch + clutch.clutcherKillCount, 0);
    const averageKill = roundNumber(killCount / clutches.length, 1);
    return (React.createElement("div", { className: "flex w-[192px] flex-col rounded border border-gray-300 bg-gray-100 p-8" },
        React.createElement("p", { className: "text-body-strong" }, title),
        React.createElement("div", { className: "mt-12 flex flex-col" },
            React.createElement(PanelStatRow, { title: React.createElement(Trans, null, "Total"), value: clutches.length }),
            React.createElement(PanelStatRow, { title: React.createElement(Trans, null, "Won"), value: wonCount }),
            React.createElement(PanelStatRow, { title: React.createElement(Trans, null, "Lost"), value: lostCount }),
            React.createElement(PanelStatRow, { title: React.createElement(Trans, null, "Avg kill"), value: averageKill }),
            React.createElement("div", { className: "flex flex-col gap-y-px" },
                React.createElement(WinRate, { value: winRate, barClassName: "bg-green-700" }),
                React.createElement(WinRate, { title: React.createElement(Trans, null, "Save rate"), value: saveRate, barClassName: "bg-orange-700" })))));
}
export function Clutches({ clutches }) {
    return (React.createElement(Section, { title: React.createElement(Trans, null, "Clutches") },
        React.createElement("div", { className: "flex flex-wrap gap-12" },
            React.createElement(ClutchPanel, { opponentCount: 0, title: React.createElement(Trans, null, "Overall"), allClutches: clutches }),
            React.createElement(ClutchPanel, { opponentCount: 1, title: React.createElement(Trans, null, "1v1"), allClutches: clutches }),
            React.createElement(ClutchPanel, { opponentCount: 2, title: React.createElement(Trans, null, "1v2"), allClutches: clutches }),
            React.createElement(ClutchPanel, { opponentCount: 3, title: React.createElement(Trans, null, "1v3"), allClutches: clutches }),
            React.createElement(ClutchPanel, { opponentCount: 4, title: React.createElement(Trans, null, "1v4"), allClutches: clutches }),
            React.createElement(ClutchPanel, { opponentCount: 5, title: React.createElement(Trans, null, "1v5"), allClutches: clutches }))));
}
//# sourceMappingURL=clutches.js.map