import React, { memo } from 'react';
import { RoundButton } from './round-button';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
export const RoundsBar = memo(() => {
    const match = useCurrentMatch();
    return (React.createElement("div", { className: "relative flex h-48 overflow-auto border-b border-b-gray-300 bg-gray-50" }, match.rounds.map((round) => {
        return React.createElement(RoundButton, { key: round.number, round: round });
    })));
});
RoundsBar.displayName = 'RoundsBar';
//# sourceMappingURL=rounds-bar.js.map