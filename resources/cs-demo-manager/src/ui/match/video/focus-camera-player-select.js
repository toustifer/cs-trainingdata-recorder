import React, { useRef } from 'react';
import { Trans } from '@lingui/react/macro';
import { Select } from 'csdm/ui/components/inputs/select';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { Checkbox } from 'csdm/ui/components/inputs/checkbox';
export function FocusCameraPlayerSelect({ playerFocusSteamId, onChange, label }) {
    const match = useCurrentMatch();
    const options = match.players
        .toSorted((playerA, playerB) => {
        return playerA.name.localeCompare(playerB.name);
    })
        .map((player) => {
        return {
            value: player.steamId,
            label: player.name,
        };
    });
    const lastSelectedSteamId = useRef(playerFocusSteamId);
    const isChecked = playerFocusSteamId !== undefined;
    const isDisabled = options.length === 0 || playerFocusSteamId === undefined;
    return (React.createElement("div", { className: "flex flex-col gap-y-8" },
        React.createElement("div", { className: "flex gap-x-8" },
            React.createElement(Checkbox, { label: label ?? React.createElement(Trans, { context: "Checkbox label" }, "Focus camera on player"), isChecked: isChecked, onChange: (event) => {
                    let newSelectedSteamId = undefined;
                    if (event.target.checked) {
                        if (lastSelectedSteamId.current) {
                            newSelectedSteamId = lastSelectedSteamId.current;
                        }
                        else {
                            newSelectedSteamId = options.length > 0 ? options[0].value : undefined;
                        }
                    }
                    onChange(newSelectedSteamId);
                    lastSelectedSteamId.current = playerFocusSteamId;
                } })),
        React.createElement("div", null,
            React.createElement(Select, { options: options, isDisabled: isDisabled, value: playerFocusSteamId, onChange: (steamId) => {
                    onChange(steamId);
                    lastSelectedSteamId.current = steamId;
                } }))));
}
//# sourceMappingURL=focus-camera-player-select.js.map