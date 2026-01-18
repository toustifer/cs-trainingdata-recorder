import React, { useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { Button } from 'csdm/ui/components/buttons/button';
import { Select } from 'csdm/ui/components/inputs/select';
import { useCurrentMatch } from '../use-current-match';
import { generatePlayersDeathsSequences, generatePlayersKillsSequences, generatePlayersRoundsSequences, } from './sequences/sequences-actions';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'csdm/ui/dialogs/dialog';
import { CancelButton } from 'csdm/ui/components/buttons/cancel-button';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { PlayerSequenceEvent } from 'csdm/common/types/player-sequence-event';
import { WeaponsFilter } from 'csdm/ui/components/dropdown-filter/weapons-filter';
import { uniqueArray } from 'csdm/common/array/unique-array';
import { ExclamationTriangleIcon } from 'csdm/ui/icons/exclamation-triangle-icon';
import { Perspective } from 'csdm/common/types/perspective';
import { assertNever } from 'csdm/common/assert-never';
import { useVideoSettings } from 'csdm/ui/settings/video/use-video-settings';
import { SecondsInput } from 'csdm/ui/components/inputs/seconds-input';
import { ConfirmButton } from 'csdm/ui/components/buttons/confirm-button';
import { PlayersSelect } from 'csdm/ui/components/inputs/select/players-select';
import { RoundsSelect } from 'csdm/ui/components/inputs/select/rounds-select';
import { Checkbox } from 'csdm/ui/components/inputs/checkbox';
function getVisibleWeapons(event, steamIds, match) {
    if (steamIds.length === 0) {
        return [];
    }
    const key = event === PlayerSequenceEvent.Kills ? 'killerSteamId' : 'victimSteamId';
    return uniqueArray(match.kills
        .filter((kill) => {
        return steamIds.includes(kill[key]);
    })
        .map((kill) => kill.weaponName));
}
function SelectPlayerDialog() {
    const dispatch = useDispatch();
    const match = useCurrentMatch();
    const { settings } = useVideoSettings();
    const { hideDialog } = useDialog();
    const options = match.players.map((player) => {
        return {
            value: player.steamId,
            label: player.name,
        };
    });
    const eventOptions = [
        {
            value: PlayerSequenceEvent.Kills,
            label: React.createElement(Trans, { context: "Select option" }, "Kill"),
        },
        {
            value: PlayerSequenceEvent.Deaths,
            label: React.createElement(Trans, { context: "Select option" }, "Death"),
        },
        {
            value: PlayerSequenceEvent.Rounds,
            label: React.createElement(Trans, { context: "Select option" }, "Round"),
        },
    ];
    const [selectedSteamIds, setSelectedSteamIds] = useState(options.length > 0 ? [options[0].value] : []);
    const [selectedEvent, setSelectedEvent] = useState(PlayerSequenceEvent.Kills);
    const [selectedRounds, setSelectedRounds] = useState([]);
    const visibleWeapons = getVisibleWeapons(selectedEvent, selectedSteamIds, match);
    const [selectedWeapons, setSelectedWeapons] = useState(visibleWeapons);
    const [perspective, setPerspective] = useState(Perspective.Player);
    const [startSecondsBeforeEvent, setStartSecondsBeforeEvent] = useState(2);
    const [endSecondsAfterEvent, setEndSecondsAfterEvent] = useState(2);
    const [preserveExistingSequences, setPreserveExistingSequences] = useState(false);
    const onConfirm = () => {
        if (!selectedSteamIds) {
            return;
        }
        switch (selectedEvent) {
            case PlayerSequenceEvent.Deaths:
                dispatch(generatePlayersDeathsSequences({
                    match,
                    perspective,
                    steamIds: selectedSteamIds,
                    rounds: selectedRounds,
                    weapons: selectedWeapons,
                    settings,
                    startSecondsBeforeEvent,
                    endSecondsAfterEvent,
                    preserveExistingSequences,
                }));
                break;
            case PlayerSequenceEvent.Kills:
                dispatch(generatePlayersKillsSequences({
                    match,
                    perspective,
                    steamIds: selectedSteamIds,
                    rounds: selectedRounds,
                    weapons: selectedWeapons,
                    settings,
                    startSecondsBeforeEvent,
                    endSecondsAfterEvent,
                    preserveExistingSequences,
                }));
                break;
            case PlayerSequenceEvent.Rounds:
                dispatch(generatePlayersRoundsSequences({
                    match,
                    steamIds: selectedSteamIds,
                    rounds: selectedRounds,
                    settings,
                    startSecondsBeforeEvent,
                    endSecondsAfterEvent,
                    preserveExistingSequences,
                }));
                break;
            default:
                return assertNever(selectedEvent, `Unknown player sequence event: ${selectedEvent}`);
        }
        hideDialog();
    };
    const renderSelectedEventOptions = () => {
        if (selectedEvent === PlayerSequenceEvent.Rounds) {
            return (React.createElement(React.Fragment, null,
                React.createElement(SecondsInput, { key: "round-start-delay", label: React.createElement(Trans, { context: "Input label" }, "Seconds before the round starts to start the sequence"), defaultValue: startSecondsBeforeEvent, onChange: setStartSecondsBeforeEvent }),
                React.createElement(SecondsInput, { key: "round-end-delay", label: React.createElement(Trans, { context: "Input label" }, "Seconds after the round ends or the player dies to stop the sequence"), defaultValue: endSecondsAfterEvent, onChange: setEndSecondsAfterEvent })));
        }
        return (React.createElement(React.Fragment, null,
            React.createElement("div", { className: "flex flex-col gap-y-8" },
                React.createElement("label", { htmlFor: "pov" },
                    React.createElement(Trans, { context: "Select label" }, "POV")),
                React.createElement("div", null,
                    React.createElement(Select, { id: "pov", options: [
                            {
                                value: Perspective.Player,
                                label: React.createElement(Trans, { context: "Select option" }, "Player"),
                            },
                            {
                                value: Perspective.Enemy,
                                label: React.createElement(Trans, { context: "Select option" }, "Enemy"),
                            },
                        ], value: perspective, onChange: setPerspective }))),
            React.createElement(SecondsInput, { label: React.createElement(Trans, { context: "Input label" }, "Seconds before each kill to start the sequence"), defaultValue: startSecondsBeforeEvent, onChange: setStartSecondsBeforeEvent }),
            React.createElement(SecondsInput, { label: React.createElement(Trans, { context: "Input label" }, "Seconds after each kill to stop the sequence"), defaultValue: endSecondsAfterEvent, onChange: setEndSecondsAfterEvent }),
            visibleWeapons.length > 0 ? (React.createElement(WeaponsFilter, { weapons: visibleWeapons, selectedWeapons: selectedWeapons, hasActiveFilter: selectedWeapons.length > 0 && selectedWeapons.length !== visibleWeapons.length, onChange: (weapons) => {
                    setSelectedWeapons(weapons);
                } })) : (React.createElement("p", null,
                React.createElement(Trans, null, "No action found for this player"))),
            React.createElement(Checkbox, { label: React.createElement(Trans, { context: "Checkbox label" }, "Preserve existing sequences"), isChecked: preserveExistingSequences, onChange: (event) => {
                    setPreserveExistingSequences(event.target.checked);
                } }),
            React.createElement("div", { className: "flex items-center gap-x-8" },
                React.createElement(ExclamationTriangleIcon, { className: "size-20 text-orange-700" }),
                React.createElement("p", { className: "text-caption" },
                    React.createElement(Trans, null, "If 2 actions occurred less than 10 seconds apart or 2 actions are less than 2 seconds apart, a single sequence will be generated.")))));
    };
    return (React.createElement(Dialog, { onEnterPressed: onConfirm },
        React.createElement(DialogHeader, null,
            React.createElement(DialogTitle, null,
                React.createElement(Trans, { context: "Dialog title" }, "Generate player's sequences"))),
        React.createElement(DialogContent, null,
            React.createElement("div", { className: "flex w-[512px] flex-col gap-y-12" },
                React.createElement(PlayersSelect, { players: match.players, selectedSteamIds: selectedSteamIds, onChange: (steamIds) => {
                        setSelectedSteamIds(steamIds);
                        const selectedWeapons = getVisibleWeapons(selectedEvent, steamIds, match);
                        setSelectedWeapons(selectedWeapons);
                    } }),
                React.createElement("div", { className: "flex flex-col gap-y-8" },
                    React.createElement("label", { htmlFor: "event" },
                        React.createElement(Trans, { context: "Select label" }, "Event")),
                    React.createElement("div", null,
                        React.createElement(Select, { id: "event", options: eventOptions, value: selectedEvent, onChange: (event) => {
                                setSelectedEvent(event);
                                const selectedWeapons = getVisibleWeapons(event, selectedSteamIds, match);
                                setSelectedWeapons(selectedWeapons);
                                if (event === PlayerSequenceEvent.Rounds) {
                                    setStartSecondsBeforeEvent(0);
                                    setEndSecondsAfterEvent(2);
                                }
                                else {
                                    setStartSecondsBeforeEvent(2);
                                    setEndSecondsAfterEvent(2);
                                }
                            } }))),
                React.createElement(RoundsSelect, { rounds: match.rounds, selectedRoundNumbers: selectedRounds, onChange: setSelectedRounds }),
                renderSelectedEventOptions())),
        React.createElement(DialogFooter, null,
            React.createElement(ConfirmButton, { onClick: onConfirm }),
            React.createElement(CancelButton, { onClick: hideDialog }))));
}
export function GeneratePlayerSequencesButton() {
    const { showDialog } = useDialog();
    const onClick = () => {
        showDialog(React.createElement(SelectPlayerDialog, null));
    };
    return (React.createElement(Button, { onClick: onClick },
        React.createElement(Trans, { context: "Button" }, "Generate player's sequences")));
}
//# sourceMappingURL=generate-player-sequences-button.js.map