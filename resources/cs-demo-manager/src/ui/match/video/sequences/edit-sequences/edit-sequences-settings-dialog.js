import React, { useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { replaceSequences } from 'csdm/ui/match/video/sequences/sequences-actions';
import { CollapseTransition } from 'csdm/ui/components/transitions/collapse-transition';
import { useCurrentMatchSequences } from 'csdm/ui/match/video/sequences/use-current-match-sequences';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'csdm/ui/dialogs/dialog';
import { CancelButton } from 'csdm/ui/components/buttons/cancel-button';
import { FocusCameraPlayerSelect } from 'csdm/ui/match/video/focus-camera-player-select';
import { XRayCheckbox } from 'csdm/ui/match/video/x-ray-checkbox';
import { Checkbox } from 'csdm/ui/components/inputs/checkbox';
import { CfgInput } from 'csdm/ui/match/video/cfg-input';
import { SequencePlayersOptions } from './player-options/sequence-players-options';
import { usePlayersOptions } from './player-options/use-players-options';
import { PlayerVoicesCheckbox } from 'csdm/ui/match/video/player-voices-checkbox';
import { ShowOnlyDeathNoticesCheckbox } from 'csdm/ui/match/video/show-only-death-notices-checkbox';
import { useCanEditVideoPlayersOptions } from 'csdm/ui/match/video/use-can-edit-video-players-options';
import { DeathNoticesDurationInput } from '../../death-notices-duration-input';
import { useVideoSettings } from 'csdm/ui/settings/video/use-video-settings';
import { ConfirmButton } from 'csdm/ui/components/buttons/confirm-button';
import { AssistsCheckbox } from '../../assists-checkbox';
import { RecordAudioCheckbox } from '../../record-audio-checkbox';
export function EditSequenceSettingsDialog() {
    const dispatch = useDispatch();
    const { hideDialog } = useDialog();
    const match = useCurrentMatch();
    const sequences = useCurrentMatchSequences();
    const { settings } = useVideoSettings();
    const [playerFocusSteamId, setPlayerFocusSteamId] = useState(undefined);
    const [showOnlyDeathNotices, setShowOnlyDeathNotices] = useState(true);
    const [showXRay, setShowXRay] = useState(false);
    const [showAssists, setShowAssists] = useState(true);
    const [playerVoicesEnabled, setPlayerVoicesEnabled] = useState(true);
    const [recordAudioEnabled, setRecordAudioEnabled] = useState(true);
    const [cfg, setCfg] = useState(undefined);
    const { options: playerOptions } = usePlayersOptions();
    const canEditPlayersOptions = useCanEditVideoPlayersOptions();
    const [state, setState] = useState({
        overridePlayerFocusSteamId: false,
        overrideDeathNoticesDuration: false,
        overridePlayerOptions: false,
        overrideCfg: false,
    });
    const onConfirm = (event) => {
        event.preventDefault();
        if (!(event.target instanceof HTMLFormElement)) {
            return;
        }
        const formData = new FormData(event.target);
        const deathNoticesDuration = parseInt(formData.get('death-notices-duration'), 10);
        const newSequences = sequences.map((sequence) => {
            const playerName = match.players.find((player) => player.steamId === playerFocusSteamId)?.name ?? '';
            return {
                ...sequence,
                showXRay,
                showAssists,
                showOnlyDeathNotices,
                deathNoticesDuration: state.overrideDeathNoticesDuration && !isNaN(deathNoticesDuration)
                    ? deathNoticesDuration
                    : sequence.deathNoticesDuration,
                playerVoicesEnabled,
                recordAudio: recordAudioEnabled,
                playerCameras: state.overridePlayerFocusSteamId && playerFocusSteamId
                    ? [{ tick: sequence.startTick, playerSteamId: playerFocusSteamId, playerName }]
                    : sequence.playerCameras,
                cfg: state.overrideCfg ? cfg : sequence.cfg,
                playersOptions: state.overridePlayerOptions ? playerOptions : sequence.playersOptions,
            };
        });
        dispatch(replaceSequences({
            demoFilePath: match.demoFilePath,
            sequences: newSequences,
        }));
        hideDialog();
    };
    return (React.createElement(Dialog, null,
        React.createElement(DialogHeader, null,
            React.createElement(DialogTitle, null,
                React.createElement(Trans, { context: "Dialog title" }, "Edit sequences settings"))),
        React.createElement("form", { onSubmit: onConfirm },
            React.createElement(DialogContent, null,
                React.createElement("div", { className: "flex max-h-[500px] flex-col gap-y-8 overflow-hidden" },
                    React.createElement("p", null,
                        React.createElement(Trans, null, "The following settings will be applied to all existing sequences.")),
                    React.createElement(XRayCheckbox, { defaultChecked: showXRay, onChange: setShowXRay }),
                    React.createElement(AssistsCheckbox, { defaultChecked: showAssists, onChange: setShowAssists }),
                    React.createElement(ShowOnlyDeathNoticesCheckbox, { isChecked: showOnlyDeathNotices, onChange: setShowOnlyDeathNotices }),
                    window.csdm.isWindows && (React.createElement("div", { className: "flex flex-col gap-y-4" },
                        React.createElement(Checkbox, { label: React.createElement(Trans, null, "Override death notices duration"), isChecked: state.overrideDeathNoticesDuration, onChange: (event) => {
                                setState({ ...state, overrideDeathNoticesDuration: event.target.checked });
                            } }),
                        React.createElement(CollapseTransition, { isVisible: state.overrideDeathNoticesDuration },
                            React.createElement(DeathNoticesDurationInput, { value: settings.deathNoticesDuration })))),
                    React.createElement(RecordAudioCheckbox, { defaultChecked: recordAudioEnabled, onChange: setRecordAudioEnabled }),
                    React.createElement(PlayerVoicesCheckbox, { defaultChecked: playerVoicesEnabled, onChange: setPlayerVoicesEnabled }),
                    React.createElement("div", { className: "flex flex-col gap-y-4" },
                        React.createElement(Checkbox, { label: React.createElement(Trans, null, "Override camera focus"), isChecked: state.overridePlayerFocusSteamId, onChange: (event) => {
                                setState({ ...state, overridePlayerFocusSteamId: event.target.checked });
                            } }),
                        React.createElement(CollapseTransition, { isVisible: state.overridePlayerFocusSteamId },
                            React.createElement("div", { className: "ml-16" },
                                React.createElement(FocusCameraPlayerSelect, { onChange: setPlayerFocusSteamId, playerFocusSteamId: playerFocusSteamId })))),
                    React.createElement("div", { className: "flex flex-col gap-y-4" },
                        React.createElement(Checkbox, { label: React.createElement(Trans, null, "Override CFG"), isChecked: state.overrideCfg, onChange: (event) => {
                                setState({ ...state, overrideCfg: event.target.checked });
                            } }),
                        React.createElement(CollapseTransition, { isVisible: state.overrideCfg },
                            React.createElement("div", { className: "h-[180px] w-full" },
                                React.createElement(CfgInput, { cfg: cfg, onBlur: (event) => {
                                        setCfg(event.target.value);
                                    } })))),
                    canEditPlayersOptions && (React.createElement("div", { className: "flex flex-col gap-y-4" },
                        React.createElement(Checkbox, { label: React.createElement(Trans, null, "Override player options"), isChecked: state.overridePlayerOptions, onChange: (event) => {
                                setState({ ...state, overridePlayerOptions: event.target.checked });
                            } }),
                        React.createElement(CollapseTransition, { isVisible: state.overridePlayerOptions },
                            React.createElement("div", { className: "max-h-[calc(300px-var(--table-row-height)-2px)] overflow-y-auto" },
                                React.createElement(SequencePlayersOptions, null))))))),
            React.createElement(DialogFooter, null,
                React.createElement(ConfirmButton, { type: "submit" }),
                React.createElement(CancelButton, { onClick: hideDialog })))));
}
//# sourceMappingURL=edit-sequences-settings-dialog.js.map