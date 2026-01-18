import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Panel } from '../../../components/panel';
import { useCurrentRound } from './use-current-round';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { TeamText } from 'csdm/ui/components/team-text';
export function Clutches() {
    const currentRound = useCurrentRound();
    const match = useCurrentMatch();
    const clutches = match.clutches.filter((clutch) => {
        return clutch.roundNumber === currentRound.number;
    });
    function renderPanelContent(clutches) {
        if (clutches.length === 0) {
            return (React.createElement("p", null,
                React.createElement(Trans, null, "No clutches in this round")));
        }
        return clutches.map((clutch) => {
            const clutcherName = (React.createElement(TeamText, { className: "inline-block", teamNumber: clutch.side }, clutch.clutcherName));
            const opponentCount = clutch.opponentCount;
            return (React.createElement("p", { key: `${clutch.clutcherName}-${clutch.tick}` }, clutch.won ? (React.createElement(Trans, null,
                clutcherName,
                " won a 1v",
                opponentCount)) : (React.createElement(Trans, null,
                clutcherName,
                " lost a 1v",
                opponentCount))));
        });
    }
    return (React.createElement(Panel, { header: React.createElement(Trans, { context: "Panel title" }, "Clutches"), fitHeight: true }, renderPanelContent(clutches)));
}
//# sourceMappingURL=clutches.js.map