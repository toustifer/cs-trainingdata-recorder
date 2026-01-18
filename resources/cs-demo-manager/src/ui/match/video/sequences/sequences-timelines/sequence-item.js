import React from 'react';
import { Plural, Trans } from '@lingui/react/macro';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { ContextMenu } from 'csdm/ui/components/context-menu/context-menu';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
import { useContextMenu } from 'csdm/ui/components/context-menu/use-context-menu';
import { scaleStyle } from 'csdm/ui/components/timeline/use-timeline';
import { Tooltip } from 'csdm/ui/components/tooltip';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { deleteSequence } from '../sequences-actions';
import { VideoIcon } from 'csdm/ui/icons/video-icon';
import { FocusIcon } from 'csdm/ui/icons/focus-icon';
function SequenceContextMenu({ sequence, onEditClick }) {
    const dispatch = useDispatch();
    const match = useCurrentMatch();
    const handleEditClick = () => {
        onEditClick(sequence);
    };
    const onDeleteClick = () => {
        dispatch(deleteSequence({ demoFilePath: match.demoFilePath, sequence }));
    };
    return (React.createElement(ContextMenu, null,
        React.createElement(ContextMenuItem, { onClick: handleEditClick },
            React.createElement(Trans, { context: "Context menu" }, "Edit")),
        React.createElement(ContextMenuItem, { onClick: onDeleteClick },
            React.createElement(Trans, { context: "Context menu" }, "Delete"))));
}
function TooltipContent({ sequence, durationInSeconds, cameraCount, focusPlayerName }) {
    const { number, startTick, endTick } = sequence;
    return (React.createElement("div", null,
        React.createElement("p", { className: "mb-4" },
            React.createElement(Trans, null,
                "Sequence ",
                React.createElement("strong", null,
                    "#",
                    number))),
        React.createElement("p", null,
            React.createElement(Trans, null,
                "Tick ",
                React.createElement("strong", null, startTick),
                " to ",
                React.createElement("strong", null, endTick),
                " (",
                React.createElement("strong", null,
                    durationInSeconds,
                    "s"),
                ")")),
        cameraCount > 0 && (React.createElement("p", null,
            React.createElement(Plural, { value: cameraCount, one: "# camera focus point", other: "# camera focus points" }))),
        focusPlayerName && (React.createElement("p", null,
            React.createElement(Trans, null,
                "First camera focus point on ",
                React.createElement("strong", null, focusPlayerName))))));
}
export function SequenceItem({ sequence, ticksPerSecond, onEditClick }) {
    const { showContextMenu } = useContextMenu();
    const onContextMenu = (event) => {
        showContextMenu(event.nativeEvent, React.createElement(SequenceContextMenu, { sequence: sequence, onEditClick: onEditClick }));
    };
    const durationInSeconds = Math.round((sequence.endTick - sequence.startTick) / ticksPerSecond);
    const cameraCount = sequence.playerCameras.length;
    const [firstCamera] = sequence.playerCameras;
    const focusPlayerName = firstCamera?.playerName;
    return (React.createElement(Tooltip, { content: React.createElement(TooltipContent, { sequence: sequence, durationInSeconds: durationInSeconds, cameraCount: cameraCount, focusPlayerName: focusPlayerName }), placement: "top", renderInPortal: true },
        React.createElement("div", { className: "flex size-full flex-col justify-center overflow-hidden border-y border-gray-700 bg-gray-75 text-gray-900", onContextMenu: onContextMenu, onDoubleClick: () => onEditClick(sequence) },
            React.createElement("div", { className: "absolute left-0 h-full w-px origin-left bg-gray-900", style: scaleStyle }),
            React.createElement("div", { className: "absolute right-0 h-full w-px origin-right bg-gray-900", style: scaleStyle }),
            React.createElement("div", { className: "origin-left pl-4 whitespace-nowrap", style: scaleStyle },
                React.createElement("p", null, `#${sequence.number}`),
                React.createElement("p", null, `${durationInSeconds}s`),
                React.createElement("p", null, `${sequence.startTick}-${sequence.endTick}`),
                React.createElement("div", null, cameraCount > 0 && (React.createElement("div", { className: "inline-flex items-center gap-x-4" },
                    React.createElement(VideoIcon, { className: "size-16" }),
                    React.createElement("span", null, cameraCount)))),
                React.createElement("div", null, focusPlayerName && (React.createElement("div", { className: "inline-flex items-center gap-x-4" },
                    React.createElement(FocusIcon, { className: "size-16" }),
                    React.createElement("span", null, focusPlayerName))))))));
}
//# sourceMappingURL=sequence-item.js.map