import React from 'react';
import { useCurrentMatch } from '../../use-current-match';
import { getSequencePlayerColor } from './get-sequence-player-color';
export function PlayersColors() {
    const match = useCurrentMatch();
    return (React.createElement("div", { className: "mb-4 flex items-center gap-x-12 gap-y-4" }, match.players.map((player, index) => {
        return (React.createElement("div", { className: "flex items-center gap-x-4", key: player.steamId },
            React.createElement("div", { className: "size-12 rounded-full", style: { backgroundColor: getSequencePlayerColor(index) } }),
            React.createElement("p", null, player.name)));
    })));
}
//# sourceMappingURL=players-colors.js.map