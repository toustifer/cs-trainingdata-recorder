import React, { useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { Button } from 'csdm/ui/components/buttons/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'csdm/ui/dialogs/dialog';
import { CancelButton } from 'csdm/ui/components/buttons/cancel-button';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { FocusCameraPlayerSelect } from 'csdm/ui/match/video/focus-camera-player-select';
import { KillFocusCameraPovSelect } from 'csdm/ui/match/video/sequence/cameras/focus-camera-kill-pov-input';
import { WeaponType } from 'csdm/common/types/counter-strike';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { ExclamationTriangleIcon } from 'csdm/ui/icons/exclamation-triangle-icon';
export function GenerateCamerasDialog({ sequenceContext }) {
    const match = useCurrentMatch();
    const { hideDialog } = useDialog();
    const { sequence, updateSequence } = sequenceContext;
    const [form, setForm] = useState({
        playerFocusSteamId: undefined,
        killCameraPov: undefined,
        beforeKillDelaySeconds: 2,
    });
    const onSubmit = () => {
        const startTick = Number(sequence.startTick);
        const endTick = Number(sequence.endTick);
        const cameras = [];
        if (form.playerFocusSteamId) {
            cameras.push({
                tick: startTick,
                playerSteamId: form.playerFocusSteamId,
                playerName: match.players.find((player) => player.steamId === form.playerFocusSteamId)?.name ?? '',
            });
        }
        if (typeof form.killCameraPov === 'string') {
            const killsInSequence = match.kills.filter((kill) => {
                return kill.tick >= startTick && kill.tick <= endTick;
            });
            if (form.killCameraPov === 'killer') {
                for (const kill of killsInSequence) {
                    if (kill.weaponType === WeaponType.World) {
                        continue;
                    }
                    cameras.push({
                        tick: Math.round(kill.tick - form.beforeKillDelaySeconds * match.tickrate),
                        playerSteamId: kill.killerSteamId,
                        playerName: kill.killerName,
                    });
                }
            }
            else {
                for (const kill of killsInSequence) {
                    cameras.push({
                        tick: Math.round(kill.tick - form.beforeKillDelaySeconds * match.tickrate),
                        playerSteamId: kill.victimSteamId,
                        playerName: kill.victimName,
                    });
                }
            }
        }
        updateSequence({
            playerCameras: cameras,
        });
        hideDialog();
    };
    const { startTick, endTick } = sequence;
    const duration = Math.round((Number(endTick) - Number(startTick)) / match.tickrate);
    return (React.createElement(Dialog, null,
        React.createElement(DialogHeader, null,
            React.createElement(DialogTitle, null,
                React.createElement(Trans, { context: "Dialog title" }, "Generate cameras"))),
        React.createElement(DialogContent, null,
            React.createElement("form", { id: "cameras-form", className: "flex flex-col gap-y-24", onSubmit: onSubmit },
                React.createElement("div", { className: "flex items-center gap-x-8" },
                    React.createElement(ExclamationTriangleIcon, { className: "size-16 text-orange-700" }),
                    React.createElement("p", null,
                        React.createElement(Trans, null,
                            "The sequence is from tick ",
                            React.createElement("strong", null, startTick),
                            " to ",
                            React.createElement("strong", null, endTick),
                            " (",
                            React.createElement("strong", null,
                                duration,
                                "s"),
                            ")."))),
                React.createElement(FocusCameraPlayerSelect, { label: React.createElement(Trans, null, "Focus the camera on the following player when the sequence start"), playerFocusSteamId: form.playerFocusSteamId, onChange: (steamId) => {
                        setForm({ ...form, playerFocusSteamId: steamId });
                    } }),
                React.createElement(KillFocusCameraPovSelect, { pov: form.killCameraPov, onPovChange: (pov) => {
                        setForm({ ...form, killCameraPov: pov });
                    }, beforeKillDelaySeconds: form.beforeKillDelaySeconds, onBeforeKillDelaySecondsChange: (seconds) => {
                        setForm({ ...form, beforeKillDelaySeconds: seconds });
                    } }))),
        React.createElement(DialogFooter, null,
            React.createElement(Button, { type: "submit", form: "cameras-form", onClick: onSubmit },
                React.createElement(Trans, { context: "Button" }, "Generate")),
            React.createElement(CancelButton, { onClick: hideDialog }))));
}
//# sourceMappingURL=generate-cameras-dialog.js.map