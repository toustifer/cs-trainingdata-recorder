import React, {} from 'react';
import { Trans } from '@lingui/react/macro';
import clsx from 'clsx';
import { VideoStatus } from 'csdm/common/types/video-status';
import { assertNever } from 'csdm/common/assert-never';
import { Button, ButtonVariant } from 'csdm/ui/components/buttons/button';
import { Spinner } from 'csdm/ui/components/spinner';
import { useGetSequencesRequiredDiskSpace } from 'csdm/ui/match/video/sequences/use-get-sequences-required-disk-space';
import { RequiredDiskSpace } from 'csdm/ui/match/video/sequences/required-disk-space';
import { SequencesDuration } from 'csdm/ui/match/video/sequences/sequences-duration';
import { CheckCircleIcon } from 'csdm/ui/icons/check-circle-icon';
import { TimesCircleIcon } from 'csdm/ui/icons/times-circle';
import { ExclamationTriangleIcon } from 'csdm/ui/icons/exclamation-triangle-icon';
import { getPlaybackErrorMessageFromErrorCode } from 'csdm/ui/shared/get-playback-error-from-error-code';
import { useShowToast } from 'csdm/ui/components/toasts/use-show-toast';
import { TextInput } from 'csdm/ui/components/inputs/text-input';
import { RevealButton } from 'csdm/ui/components/buttons/reveal-button';
import { useGetMapThumbnailSrc } from 'csdm/ui/maps/use-get-map-thumbnail-src';
import { Card } from 'csdm/ui/components/card';
import { Tooltip } from 'csdm/ui/components/tooltip';
import { useRemoveVideos } from './use-remove-videos';
import { useWebSocketClient } from '../hooks/use-web-socket-client';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { isErrorCode } from 'csdm/common/is-error-code';
import { ErrorCode } from 'csdm/common/error-code';
import { AddVideoToQueueErrorDialog } from '../match/video/add-video-to-queue-error-dialog';
import { useDialog } from '../components/dialogs/use-dialog';
import { RetryButton } from '../components/buttons/retry-button';
import { RecordingOutput } from '../match/video/recording-output';
function Grid({ children }) {
    return React.createElement("div", { className: "grid grid-cols-[auto_1fr] items-center gap-x-8 gap-y-4" }, children);
}
function Field({ label, children, isSelectable = false }) {
    return (React.createElement(React.Fragment, null,
        React.createElement("p", null, label),
        React.createElement("div", { className: clsx('text-body-strong break-all', isSelectable ? 'selectable' : 'select-none') }, children)));
}
function SequenceListHeader({ children }) {
    return React.createElement("p", { className: "truncate" }, children);
}
function getStatusMessage(video) {
    switch (video.status) {
        case VideoStatus.Pending:
            return (React.createElement("p", null,
                React.createElement(Trans, null, "Waiting\u2026")));
        case VideoStatus.Recording:
            return (React.createElement("p", null,
                React.createElement(Trans, null, "In-game recording in progress\u2026")));
        case VideoStatus.MovingFiles:
            return (React.createElement("p", null,
                React.createElement(Trans, null, "Moving final files\u2026")));
        case VideoStatus.Converting: {
            const number = video.currentSequence;
            const sequenceCount = video.sequences.length;
            return (React.createElement("p", null,
                React.createElement(Trans, null,
                    "Generating video for sequence ",
                    number,
                    " / ",
                    sequenceCount,
                    "\u2026")));
        }
        case VideoStatus.Concatenating:
            return (React.createElement("p", null,
                React.createElement(Trans, null, "Merging videos into a single file\u2026")));
        case VideoStatus.Error:
            return (React.createElement("p", null,
                React.createElement(Trans, null, "An error occurred")));
        case VideoStatus.Success:
            return (React.createElement("p", null,
                React.createElement(Trans, null, "Video generation done")));
        default:
            assertNever(video.status, `Unsupported video status: ${video.status}`);
    }
}
export function VideoEntry({ video }) {
    const getRequiredDiskSpace = useGetSequencesRequiredDiskSpace();
    const getMapThumbnailSrc = useGetMapThumbnailSrc();
    const showToast = useShowToast();
    const { showDialog } = useDialog();
    const client = useWebSocketClient();
    const { isRemovingVideos, removeVideos } = useRemoveVideos();
    const tryRevealFolder = async (folderPath) => {
        const folderExists = await window.csdm.pathExists(folderPath);
        if (folderExists) {
            window.csdm.browseToFolder(folderPath);
        }
        else {
            showToast({
                id: 'output-folder-doesnt-exist',
                content: React.createElement(Trans, null, "The folder doesn't exist yet"),
                type: 'warning',
            });
        }
    };
    const onRevealOutputFolderClick = async () => {
        await tryRevealFolder(video.outputFolderPath);
    };
    const renderCurrentStepMessage = (video) => {
        const message = video.errorCode
            ? getPlaybackErrorMessageFromErrorCode(video.game, video.errorCode)
            : getStatusMessage(video);
        switch (video.status) {
            case VideoStatus.Pending:
                return message;
            case VideoStatus.Success:
                return (React.createElement("div", { className: "flex items-center gap-x-8" },
                    React.createElement(CheckCircleIcon, { className: "size-20 text-green-500" }),
                    message));
            case VideoStatus.Error:
                return (React.createElement("div", { className: "flex items-center gap-x-8" },
                    React.createElement(TimesCircleIcon, { className: "size-20 text-red-500" }),
                    message));
            default:
                return (React.createElement("div", { className: "flex items-center gap-x-8" },
                    React.createElement(Spinner, { size: 20 }),
                    message));
        }
    };
    const onRetryClick = async () => {
        try {
            await client.send({
                name: RendererClientMessageName.AddVideoToQueue,
                payload: video,
            });
        }
        catch (error) {
            const errorCode = isErrorCode(error) ? error : ErrorCode.UnknownError;
            const message = getPlaybackErrorMessageFromErrorCode(video.game, errorCode);
            showDialog(React.createElement(AddVideoToQueueErrorDialog, null, message));
        }
    };
    return (React.createElement(Card, null,
        React.createElement("div", { className: "flex flex-col gap-y-8" },
            React.createElement("div", { className: "flex items-center gap-x-12" },
                React.createElement(Button, { variant: ButtonVariant.Danger, isDisabled: isRemovingVideos, onClick: async () => {
                        await removeVideos([video.id]);
                    } },
                    React.createElement(Trans, { context: "Button" }, "Remove")),
                video.status === VideoStatus.Error && React.createElement(RetryButton, { onClick: onRetryClick }),
                renderCurrentStepMessage(video)),
            React.createElement("div", { className: "flex" },
                React.createElement("img", { src: getMapThumbnailSrc(video.mapName, video.game), alt: video.mapName, className: "mr-8 h-[92px] self-center rounded-4" }),
                React.createElement("div", { className: "flex flex-wrap items-start gap-x-16" },
                    React.createElement(Grid, null,
                        React.createElement(Field, { label: React.createElement(Trans, null, "Map") }, video.mapName),
                        React.createElement(Field, { label: React.createElement(Trans, null, "Video ID"), isSelectable: true }, video.id),
                        React.createElement(Field, { label: React.createElement(Trans, null, "Sequences") }, video.sequences.length),
                        React.createElement(Field, { label: React.createElement(Trans, null, "Duration") }, React.createElement(SequencesDuration, { sequences: video.sequences, tickrate: video.tickrate })),
                        React.createElement(Field, { label: React.createElement(Trans, null, "Disk space") },
                            React.createElement(RequiredDiskSpace, { bytes: getRequiredDiskSpace(video.sequences, video.tickrate) }))),
                    React.createElement(Grid, null,
                        React.createElement(Field, { label: React.createElement(Trans, null, "Encoder software") }, video.encoderSoftware),
                        React.createElement(Field, { label: React.createElement(Trans, null, "Resolution") }, `${video.width}x${video.height}`),
                        React.createElement(Field, { label: React.createElement(Trans, null, "Framerate") }, video.framerate),
                        React.createElement(Field, { label: React.createElement(Trans, null, "Merge sequences into single file") }, video.concatenateSequences ? React.createElement(Trans, null, "Yes") : React.createElement(Trans, null, "No")),
                        React.createElement(Field, { label: React.createElement(Trans, null, "Output") },
                            React.createElement(RecordingOutput, { output: video.recordingOutput }))),
                    React.createElement(Grid, null,
                        React.createElement(Field, { label: React.createElement(Trans, null, "Close game after recording") }, video.closeGameAfterRecording ? (React.createElement(Trans, null, "Yes")) : (React.createElement("div", { className: "flex items-center gap-x-4" },
                            React.createElement("span", null,
                                React.createElement(Trans, null, "No")),
                            React.createElement(Tooltip, { content: React.createElement("p", null,
                                    React.createElement(Trans, null, "You will have to close the game manually.")) },
                                React.createElement("div", null,
                                    React.createElement(ExclamationTriangleIcon, { className: "size-16 text-red-700" }))))))))),
            React.createElement("div", { className: "flex flex-col gap-y-8" },
                React.createElement(Grid, null,
                    React.createElement("p", null,
                        React.createElement(Trans, null, "Demo path")),
                    React.createElement("div", { className: "flex gap-x-8" },
                        React.createElement(TextInput, { value: video.demoPath, isReadOnly: true }),
                        React.createElement(RevealButton, { onClick: () => {
                                window.csdm.browseToFile(video.demoPath);
                            } })),
                    React.createElement("p", null,
                        React.createElement(Trans, null, "Output path")),
                    React.createElement("div", { className: "flex gap-x-8" },
                        React.createElement(TextInput, { value: video.outputFolderPath, isReadOnly: true }),
                        React.createElement(RevealButton, { onClick: onRevealOutputFolderClick }))),
                React.createElement("div", { className: "flex flex-col" },
                    React.createElement("h2", { className: "mb-4 text-body-strong" },
                        React.createElement(Trans, null, "Sequences")),
                    React.createElement("div", { className: "grid grid-cols-[60px_100px_100px_100px_100px_100px_100px_100px_1fr] gap-4 rounded-t bg-gray-200 p-4" },
                        React.createElement(SequenceListHeader, null, "#"),
                        React.createElement(SequenceListHeader, null,
                            React.createElement(Trans, null, "Start tick")),
                        React.createElement(SequenceListHeader, null,
                            React.createElement(Trans, null, "End tick")),
                        React.createElement(SequenceListHeader, null,
                            React.createElement(Trans, null, "X-Ray")),
                        React.createElement(SequenceListHeader, null,
                            React.createElement(Trans, null, "Assists")),
                        React.createElement(SequenceListHeader, null,
                            React.createElement(Trans, null, "Audio")),
                        React.createElement(SequenceListHeader, null,
                            React.createElement(Trans, null, "Player voices")),
                        React.createElement(SequenceListHeader, null,
                            React.createElement(Trans, null, "Cameras")),
                        React.createElement(SequenceListHeader, null,
                            React.createElement(Trans, null, "First camera on"))),
                    React.createElement("ul", null, video.sequences.map((sequence) => {
                        const [firstPlayerCamera] = sequence.playerCameras;
                        const [firstCustomCamera] = sequence.cameras;
                        const firstCameras = [firstPlayerCamera, firstCustomCamera].filter(Boolean).sort((cameraA, cameraB) => {
                            return cameraA.tick - cameraB.tick;
                        });
                        let firstCameraName = '';
                        const [firstCamera] = firstCameras;
                        if (firstCamera) {
                            firstCameraName = 'playerName' in firstCamera ? firstCamera.playerName : firstCamera.name;
                        }
                        return (React.createElement("li", { key: sequence.number, className: "grid grid-cols-[60px_100px_100px_100px_100px_100px_100px_100px_1fr] gap-4 border border-gray-200 p-4 last:rounded-b" },
                            React.createElement("p", null, sequence.number),
                            React.createElement("p", null, sequence.startTick),
                            React.createElement("p", null, sequence.endTick),
                            React.createElement("p", null, sequence.showXRay ? React.createElement(Trans, null, "Yes") : React.createElement(Trans, null, "No")),
                            React.createElement("p", null, sequence.showAssists ? React.createElement(Trans, null, "Yes") : React.createElement(Trans, null, "No")),
                            React.createElement("p", null, sequence.recordAudio ? React.createElement(Trans, null, "Yes") : React.createElement(Trans, null, "No")),
                            React.createElement("p", null, sequence.playerVoicesEnabled ? React.createElement(Trans, null, "Yes") : React.createElement(Trans, null, "No")),
                            React.createElement("p", null, sequence.playerCameras.length),
                            React.createElement("p", null, firstCameraName ? firstCameraName : React.createElement(Trans, null, "None"))));
                    }))),
                video.output && (React.createElement("div", { className: "flex w-full flex-col gap-y-4" },
                    React.createElement("h2", { className: "text-body-strong" },
                        React.createElement(Trans, null, "Output")),
                    React.createElement("div", { className: "max-h-[600px] overflow-auto bg-gray-75" },
                        React.createElement("pre", { className: "p-8 select-text" }, video.output))))))));
}
//# sourceMappingURL=video-entry.js.map