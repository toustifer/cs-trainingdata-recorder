import React from 'react';
import { AddNewSequenceButton } from 'csdm/ui/match/video/sequences/add-new-sequence-button';
import { MatchCommentInput } from 'csdm/ui/match/match-comment-input';
import { Content } from 'csdm/ui/components/content';
import { SequencesTimeline } from './sequences/sequences-timelines/sequences-timeline';
import { AddVideoToQueueButton } from './add-video-to-queue-button';
import { Hlae } from './hlae/hlae';
import { VirtualDub } from './virtualdub/virtual-dub';
import { WidthResolutionInput } from './width-resolution-input';
import { HeightResolutionInput } from './height-resolution-input';
import { CloseGameAfterRecordingCheckbox } from './close-game-after-recording-checkbox';
import { OutputFolderPath } from './output-folder-path';
import { EncoderSoftwareSelect } from './encoder-software-select';
import { Ffmpeg } from './ffmpeg/ffmpeg';
import { FramerateInput } from './framerate-input';
import { ConcatenateSequencesCheckbox } from './concatenate-sequences-checkbox';
import { GeneratePlayerSequencesButton } from './generate-player-sequences-button';
import { DeleteSequencesButton } from './sequences/delete-sequences-button';
import { ResetSettingsButton } from './reset-settings-button';
import { SequencesSummary } from './sequences-summary';
import { EditSequencesSettingsButton } from './sequences/edit-sequences/edit-sequences-settings-button';
import { RecordingSystemSelect } from './recording-system-select';
import { RecordingOutputSelect } from './recording-output-select';
import { DocumentationLink } from 'csdm/ui/components/links/documentation-link';
import { WatchSequencesButton } from './watch-sequences-button';
import { VideoActionsMenu } from './video-actions-menu';
export function MatchVideo() {
    return (React.createElement(Content, null,
        React.createElement("div", { className: "flex flex-col" },
            React.createElement("div", { className: "flex flex-wrap items-center gap-8" },
                React.createElement(AddVideoToQueueButton, null),
                React.createElement(AddNewSequenceButton, null),
                React.createElement(GeneratePlayerSequencesButton, null),
                React.createElement(EditSequencesSettingsButton, null),
                React.createElement(WatchSequencesButton, null),
                React.createElement(ResetSettingsButton, null),
                React.createElement(DeleteSequencesButton, null),
                React.createElement(VideoActionsMenu, null),
                React.createElement(SequencesSummary, null),
                React.createElement("div", { className: "ml-auto" },
                    React.createElement(DocumentationLink, { url: "https://cs-demo-manager.com/docs/guides/video" }))),
            React.createElement("div", { className: "mt-12 flex gap-x-12" },
                React.createElement("div", { className: "flex flex-col rounded border border-gray-400 p-8" },
                    React.createElement("div", { className: "flex gap-x-12" },
                        React.createElement("div", { className: "flex flex-col" },
                            window.csdm.isWindows && React.createElement(RecordingSystemSelect, null),
                            React.createElement(RecordingOutputSelect, null),
                            React.createElement(EncoderSoftwareSelect, null)),
                        React.createElement("div", { className: "flex flex-col gap-y-8" },
                            React.createElement(WidthResolutionInput, null),
                            React.createElement(HeightResolutionInput, null),
                            React.createElement(FramerateInput, null))),
                    React.createElement("div", { className: "flex flex-col gap-y-8" },
                        React.createElement(OutputFolderPath, null),
                        React.createElement("div", null,
                            React.createElement(CloseGameAfterRecordingCheckbox, null),
                            React.createElement(ConcatenateSequencesCheckbox, null)))),
                window.csdm.isWindows && React.createElement(Hlae, null),
                React.createElement(Ffmpeg, null),
                React.createElement(VirtualDub, null),
                React.createElement("div", { className: "w-[324px]" },
                    React.createElement(MatchCommentInput, null))),
            React.createElement("div", { className: "mt-12" },
                React.createElement(SequencesTimeline, null)))));
}
//# sourceMappingURL=video.js.map