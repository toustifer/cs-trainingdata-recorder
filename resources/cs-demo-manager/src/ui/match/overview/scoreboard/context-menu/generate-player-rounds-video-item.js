import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Trans } from '@lingui/react/macro';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { generatePlayersRoundsSequences } from 'csdm/ui/match/video/sequences/sequences-actions';
import { buildMatchVideoPath } from 'csdm/ui/routes-paths';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
import { useVideoSettings } from 'csdm/ui/settings/video/use-video-settings';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'csdm/ui/dialogs/dialog';
import { CancelButton } from 'csdm/ui/components/buttons/cancel-button';
import { SecondsInput } from 'csdm/ui/components/inputs/seconds-input';
import { ConfirmButton } from 'csdm/ui/components/buttons/confirm-button';
function GeneratePlayerRoundsDialog({ steamId }) {
    const { hideDialog } = useDialog();
    const dispatch = useDispatch();
    const match = useCurrentMatch();
    const navigate = useNavigate();
    const { settings } = useVideoSettings();
    const [startSecondsBeforeEvent, setStartSecondsBeforeEvent] = useState(0);
    const [endSecondsAfterEvent, setEndSecondsAfterEvent] = useState(2);
    const submit = () => {
        hideDialog();
        dispatch(generatePlayersRoundsSequences({
            match,
            steamIds: [steamId],
            rounds: [],
            settings,
            startSecondsBeforeEvent,
            endSecondsAfterEvent,
            preserveExistingSequences: false,
        }));
        setTimeout(() => {
            navigate(buildMatchVideoPath(match.checksum));
        }, 300);
    };
    return (React.createElement(Dialog, { onEnterPressed: submit },
        React.createElement(DialogHeader, null,
            React.createElement(DialogTitle, null,
                React.createElement(Trans, { context: "Dialog title" }, "Options"))),
        React.createElement(DialogContent, null,
            React.createElement("div", { className: "flex flex-col gap-y-8" },
                React.createElement(SecondsInput, { label: React.createElement(Trans, { context: "Input label" }, "Seconds before the round starts to start the sequence"), defaultValue: startSecondsBeforeEvent, onChange: setStartSecondsBeforeEvent }),
                React.createElement(SecondsInput, { label: React.createElement(Trans, { context: "Input label" }, "Seconds after the round ends or the player dies to stop the sequence"), defaultValue: endSecondsAfterEvent, onChange: setEndSecondsAfterEvent }))),
        React.createElement(DialogFooter, null,
            React.createElement(ConfirmButton, { onClick: submit }),
            React.createElement(CancelButton, { onClick: hideDialog }))));
}
export function GeneratePlayerRoundsVideoItem({ steamId }) {
    const { showDialog } = useDialog();
    const onClick = () => {
        showDialog(React.createElement(GeneratePlayerRoundsDialog, { steamId: steamId }));
    };
    return (React.createElement(ContextMenuItem, { onClick: onClick },
        React.createElement(Trans, { context: "Context menu" }, "Rounds")));
}
//# sourceMappingURL=generate-player-rounds-video-item.js.map