import React, { Fragment } from 'react';
import { Trans } from '@lingui/react/macro';
import { SyncIcon } from 'csdm/ui/icons/sync-icon';
import { Tooltip } from 'csdm/ui/components/tooltip';
import { getTeamColor } from 'csdm/ui/styles/get-team-color';
function Line({ sideTeamA, winnerSide }) {
    return (React.createElement("div", { className: "mx-4 flex h-[2px] grow", style: {
            alignSelf: sideTeamA === winnerSide ? 'flex-start' : 'flex-end',
            backgroundColor: getTeamColor(winnerSide),
        } }));
}
export function RoundsTimeline({ rounds }) {
    return (React.createElement("div", { className: "my-8 flex" }, rounds.map((round, index) => {
        let isNextRoundSideSwitch = false;
        if (index < rounds.length - 1) {
            isNextRoundSideSwitch = round.teamASide !== rounds[index + 1].teamASide;
        }
        return (React.createElement(Fragment, { key: round.number },
            React.createElement(Line, { winnerSide: round.winnerSide, sideTeamA: round.teamASide }),
            isNextRoundSideSwitch && (React.createElement(Tooltip, { content: React.createElement(Trans, { context: "Tooltip" }, "Switch sides") },
                React.createElement(SyncIcon, { className: "mx-8 self-center", height: 16 })))));
    })));
}
//# sourceMappingURL=rounds-timeline.js.map