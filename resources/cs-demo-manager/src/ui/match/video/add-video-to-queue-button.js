import React, { useState } from 'react';
import { useNavigate } from 'react-router';
import { Trans } from '@lingui/react/macro';
import { Button, ButtonVariant } from 'csdm/ui/components/buttons/button';
import { useCurrentMatchSequences } from './sequences/use-current-match-sequences';
import { useVideoSettings } from 'csdm/ui/settings/video/use-video-settings';
import { useCurrentMatch } from '../use-current-match';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { useSequencesRequiredDiskSpace } from './sequences/use-sequences-required-disk-space';
import { ConfirmDialog } from 'csdm/ui/dialogs/confirm-dialog';
import { Game } from 'csdm/common/types/counter-strike';
import { isErrorCode } from 'csdm/common/is-error-code';
import { ErrorCode } from 'csdm/common/error-code';
import { AddVideoToQueueErrorDialog } from './add-video-to-queue-error-dialog';
import { getPlaybackErrorMessageFromErrorCode } from '../../shared/get-playback-error-from-error-code';
import { RoutePath } from 'csdm/ui/routes-paths';
import { roundNumber } from 'csdm/common/math/round-number';
export function AddVideoToQueueButton() {
    const match = useCurrentMatch();
    const sequences = useCurrentMatchSequences();
    const { showDialog } = useDialog();
    const { settings } = useVideoSettings();
    const [isAddingVideoToQueue, setIsAddingVideoToQueue] = useState(false);
    const requiredBytes = useSequencesRequiredDiskSpace();
    const client = useWebSocketClient();
    const navigate = useNavigate();
    const addVideoToQueue = async () => {
        try {
            const payload = {
                ...settings,
                checksum: match.checksum,
                game: match.game,
                tickrate: match.tickrate,
                demoPath: match.demoFilePath,
                mapName: match.mapName,
                sequences,
            };
            await client.send({
                name: RendererClientMessageName.AddVideoToQueue,
                payload,
            });
            navigate(RoutePath.Videos);
        }
        catch (error) {
            const errorCode = isErrorCode(error) ? error : ErrorCode.UnknownError;
            const message = getPlaybackErrorMessageFromErrorCode(match.game, errorCode);
            showDialog(React.createElement(AddVideoToQueueErrorDialog, null, message));
        }
    };
    const onClick = () => {
        const tryAddingVideoToQueue = async () => {
            setIsAddingVideoToQueue(true);
            await addVideoToQueue();
            setIsAddingVideoToQueue(false);
        };
        const requiredGigaBytes = roundNumber(requiredBytes / (1024 * 1024 * 1024), 2);
        if (requiredGigaBytes > 40) {
            showDialog(React.createElement(ConfirmDialog, { title: React.createElement(Trans, null, "Disk space warning"), onConfirm: tryAddingVideoToQueue },
                React.createElement("p", null, match.game === Game.CSGO ? (React.createElement(Trans, null,
                    "You will need at least ",
                    React.createElement("strong", null,
                        requiredGigaBytes,
                        "GB"),
                    " of free disk space to generate the videos.")) : (React.createElement(Trans, null,
                    "You will need at least ",
                    React.createElement("strong", null,
                        requiredGigaBytes,
                        "GB"),
                    " of free disk space on the disk where CS2 is installed to generate the videos."))),
                React.createElement("p", null,
                    React.createElement(Trans, null, "Are you sure you want to continue?"))));
        }
        else {
            tryAddingVideoToQueue();
        }
    };
    const isDisabled = sequences.length === 0 || isAddingVideoToQueue;
    return (React.createElement(Button, { variant: ButtonVariant.Primary, onClick: onClick, isDisabled: isDisabled },
        React.createElement(Trans, { context: "Button" }, "Add to queue")));
}
//# sourceMappingURL=add-video-to-queue-button.js.map