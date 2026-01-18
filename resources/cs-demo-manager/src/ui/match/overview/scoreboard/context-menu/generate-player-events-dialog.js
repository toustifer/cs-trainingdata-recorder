import React, { useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { useNavigate } from 'react-router';
import { Perspective } from 'csdm/common/types/perspective';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { useVideoSettings } from 'csdm/ui/settings/video/use-video-settings';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'csdm/ui/dialogs/dialog';
import { PerspectiveSelect } from 'csdm/ui/components/inputs/select/perspective-select';
import { SecondsInput } from 'csdm/ui/components/inputs/seconds-input';
import { buildMatchVideoPath } from 'csdm/ui/routes-paths';
import { CancelButton } from 'csdm/ui/components/buttons/cancel-button';
import { ConfirmButton } from 'csdm/ui/components/buttons/confirm-button';
export function GeneratePlayerEventsDialog({ steamId, generateSequences, secondsBeforeLabel, secondsAfterLabel, }) {
    const { hideDialog } = useDialog();
    const match = useCurrentMatch();
    const navigate = useNavigate();
    const { settings } = useVideoSettings();
    const [perspective, setPerspective] = useState(Perspective.Player);
    const [startSecondsBeforeEvent, setStartSecondsBeforeEvent] = useState(2);
    const [endSecondsAfterEvent, setEndSecondsAfterEvent] = useState(2);
    const submit = () => {
        hideDialog();
        generateSequences({
            match,
            steamIds: [steamId],
            perspective,
            rounds: [],
            weapons: [],
            settings,
            startSecondsBeforeEvent,
            endSecondsAfterEvent,
            preserveExistingSequences: false,
        });
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
                React.createElement(PerspectiveSelect, { perspective: perspective, onChange: setPerspective }),
                React.createElement(SecondsInput, { label: secondsBeforeLabel, defaultValue: startSecondsBeforeEvent, onChange: setStartSecondsBeforeEvent }),
                React.createElement(SecondsInput, { label: secondsAfterLabel, defaultValue: endSecondsAfterEvent, onChange: setEndSecondsAfterEvent }))),
        React.createElement(DialogFooter, null,
            React.createElement(ConfirmButton, { onClick: submit }),
            React.createElement(CancelButton, { onClick: hideDialog }))));
}
//# sourceMappingURL=generate-player-events-dialog.js.map