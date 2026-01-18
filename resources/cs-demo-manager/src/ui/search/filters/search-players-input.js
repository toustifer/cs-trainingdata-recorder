import React, {} from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { useWebSocketClient } from '../../hooks/use-web-socket-client';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useShowToast } from '../../components/toasts/use-show-toast';
import { SearchInput } from '../../components/inputs/search-input';
export function SearchPlayersInput({ isDisabled, selectedPlayers, onPlayerSelected, onPlayerRemoved, label }) {
    const client = useWebSocketClient();
    const showToast = useShowToast();
    const { t } = useLingui();
    return (React.createElement("div", { className: "flex flex-col gap-y-8" },
        label ?? React.createElement(Trans, { context: "Input label" }, "Players"),
        React.createElement(SearchInput, { isDisabled: isDisabled, placeholder: t({
                context: 'Input placeholder',
                message: 'Nickname or SteamID',
            }), noResultMessage: t `No players found`, getValueId: (player) => player.steamId, onValueRemoved: onPlayerRemoved, onValueSelected: onPlayerSelected, renderResult: (player) => React.createElement("span", null, player.name), renderValue: (player) => React.createElement("span", null, player.name), selectedValues: selectedPlayers, search: async (value, ignoredPlayers) => {
                try {
                    const payload = {
                        steamIdOrName: value,
                        ignoredSteamIds: ignoredPlayers.map((player) => player.steamId),
                    };
                    const players = await client.send({
                        name: RendererClientMessageName.SearchPlayers,
                        payload,
                    });
                    return players;
                }
                catch (error) {
                    showToast({
                        type: 'error',
                        content: React.createElement(Trans, null, "An error occurred"),
                    });
                    return [];
                }
            } })));
}
//# sourceMappingURL=search-players-input.js.map