import React from 'react';
import clsx from 'clsx';
import { useViewerContext } from '../use-viewer-context';
import { TeamText } from 'csdm/ui/components/team-text';
export function RoundButton({ round }) {
    const { round: currentRound, changeRound } = useViewerContext();
    const onClick = () => {
        changeRound(round.number);
    };
    const isCurrent = currentRound.number === round.number;
    return (React.createElement("button", { className: clsx('flex w-48 min-w-48 cursor-pointer flex-col items-center justify-center border border-gray-300 text-gray-900 transition-all duration-85', isCurrent ? 'bg-gray-300 hover:bg-gray-300' : 'bg-gray-50 hover:bg-gray-100'), onClick: onClick },
        round.winnerSide !== null && React.createElement(TeamText, { teamNumber: round.winnerSide }, "\u25CF"),
        React.createElement("p", null, round.number)));
}
//# sourceMappingURL=round-button.js.map