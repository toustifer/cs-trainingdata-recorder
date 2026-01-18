import ReactDOM from 'react-dom';
import React, { useState, useEffect } from 'react';
import { MatchTimeline } from './match-timeline/match-timeline';
import { SequencePlayers } from './sequence-players';
import { StartTickInput } from './start-tick-input';
import { EndTickInput } from './end-tick-input';
import { SequenceDuration } from './sequence-duration';
import { SaveSequenceButton } from './save-sequence-button';
import { SequenceCfgInput } from './sequence-cfg-input';
import { ContextMenuProvider } from 'csdm/ui/components/context-menu/context-menu-provider';
import { FullScreenDialog } from 'csdm/ui/dialogs/full-screen-dialog';
import { SequenceFormProvider } from './sequence-form-provider';
import { SequenceDiskSpace } from './sequence-disk-space';
import { CancelButton } from 'csdm/ui/components/buttons/cancel-button';
import { SequenceXRayCheckbox } from './sequence-x-ray-checkbox';
import { SequencePlayerVoicesCheckbox } from './sequence-player-voices-checkbox';
import { SequencePlayerCamerasTable } from './cameras/sequence-player-cameras-table';
import { PlayersColors } from './players-colors';
import { SequenceShowOnlyDeathNoticesCheckbox } from './show-only-death-notices-checkbox';
import { useCanEditVideoPlayersOptions } from 'csdm/ui/match/video/use-can-edit-video-players-options';
import { SequenceDeathNoticesDurationInput } from './sequence-death-notices-duration-input';
import { SequenceAssistsCheckbox } from './sequence-assists-checkbox';
import { SequenceRecordAudioCheckbox } from './sequence-record-audio-checkbox';
import { SequenceCustomCamerasTable } from './cameras/sequence-custom-cameras-table';
export function SequenceDialog({ isVisible, closeDialog, onSaveClick, initialSequence }) {
    const [node] = useState(() => document.createElement('div'));
    const canEditPlayersOptions = useCanEditVideoPlayersOptions();
    useEffect(() => {
        document.body.appendChild(node);
        return () => {
            document.body.removeChild(node);
        };
    }, [node]);
    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Escape') {
                event.stopPropagation();
                closeDialog();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [closeDialog]);
    return ReactDOM.createPortal(React.createElement(FullScreenDialog, { isVisible: isVisible }, initialSequence !== undefined && (React.createElement(SequenceFormProvider, { initialSequence: initialSequence },
        React.createElement(ContextMenuProvider, null,
            React.createElement("div", { className: "flex h-full flex-col overflow-auto bg-gray-50 p-16" },
                React.createElement("div", { className: "mb-12 flex max-h-[520px] gap-x-12" },
                    React.createElement("div", { className: "flex max-w-[300px] flex-col gap-y-8 overflow-auto" },
                        React.createElement("div", { className: "flex flex-col gap-y-8" },
                            React.createElement(StartTickInput, null),
                            React.createElement(EndTickInput, null)),
                        React.createElement(SequenceRecordAudioCheckbox, null),
                        React.createElement(SequencePlayerVoicesCheckbox, null),
                        React.createElement(SequenceXRayCheckbox, null),
                        React.createElement(SequenceAssistsCheckbox, null),
                        React.createElement(SequenceShowOnlyDeathNoticesCheckbox, null),
                        window.csdm.isWindows && React.createElement(SequenceDeathNoticesDurationInput, null),
                        React.createElement("div", { className: "flex items-center gap-x-12" },
                            React.createElement(SequenceDuration, null),
                            React.createElement(SequenceDiskSpace, null)),
                        React.createElement("div", { className: "mt-12 flex gap-x-8" },
                            React.createElement(SaveSequenceButton, { onClick: onSaveClick, closeDialog: closeDialog }),
                            React.createElement(CancelButton, { onClick: closeDialog }))),
                    React.createElement("div", { className: "flex flex-col gap-y-8 overflow-auto" },
                        React.createElement(SequencePlayerCamerasTable, null),
                        React.createElement(SequenceCustomCamerasTable, null)),
                    canEditPlayersOptions && React.createElement(SequencePlayers, null),
                    React.createElement(SequenceCfgInput, null)),
                React.createElement(PlayersColors, null),
                React.createElement(MatchTimeline, null)))))), node);
}
//# sourceMappingURL=sequence-dialog.js.map