import React, { useState, createContext } from 'react';
export const SequencePlayersOptionsContext = createContext({
    options: [],
    update: () => {
        throw new Error('update is not implemented');
    },
});
export function SequencePlayersOptionsProvider({ children, match }) {
    const [options, update] = useState(() => {
        return match.players.map((player) => {
            return {
                steamId: player.steamId,
                playerName: player.name,
                showKill: true,
                highlightKill: false,
                isVoiceEnabled: true,
            };
        });
    });
    return (React.createElement(SequencePlayersOptionsContext, { value: {
            options,
            update,
        } }, children));
}
//# sourceMappingURL=players-options-provider.js.map