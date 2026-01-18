import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ContextMenu } from 'csdm/ui/components/context-menu/context-menu';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
import { Separator } from 'csdm/ui/components/context-menu/separator';
import { useContextMenu } from 'csdm/ui/components/context-menu/use-context-menu';
import { scaleStyle } from 'csdm/ui/components/timeline/use-timeline';
import { useSequenceForm } from '../use-sequence-form';
import { Tooltip } from 'csdm/ui/components/tooltip';
import { Markdown } from 'csdm/ui/components/markdown';
import { CommentDotsIcon } from 'csdm/ui/icons/comment-dots-icon';
function RoundContextMenu({ round }) {
    const { setStartTick, setEndTick } = useSequenceForm();
    return (React.createElement(ContextMenu, null,
        React.createElement(ContextMenuItem, { onClick: () => {
                setStartTick(round.startTick);
            } },
            React.createElement(Trans, { context: "Context menu" }, "Set round start tick as start tick")),
        React.createElement(ContextMenuItem, { onClick: () => {
                setEndTick(round.startTick);
            } },
            React.createElement(Trans, { context: "Context menu" }, "Set round start tick as end tick")),
        React.createElement(Separator, null),
        React.createElement(ContextMenuItem, { onClick: () => {
                setStartTick(round.endTick);
            } },
            React.createElement(Trans, { context: "Context menu" }, "Set round end tick as start tick")),
        React.createElement(ContextMenuItem, { onClick: () => {
                setEndTick(round.endTick);
            } },
            React.createElement(Trans, { context: "Context menu" }, "Set round end tick as end tick"))));
}
export function RoundItem({ round, ticksPerSecond }) {
    const { showContextMenu } = useContextMenu();
    const onContextMenu = (event) => {
        event.stopPropagation();
        showContextMenu(event.nativeEvent, React.createElement(RoundContextMenu, { round: round }));
    };
    const hasComment = round.comment !== '' && round.comment.length > 0;
    return (React.createElement(Tooltip, { content: React.createElement(Markdown, { markdown: round.comment }), placement: "top", renderInPortal: true, isEnabled: hasComment },
        React.createElement("div", { className: "h-full overflow-hidden border-y border-gray-900 bg-gray-75", onContextMenu: onContextMenu },
            React.createElement("div", { className: "absolute left-0 h-full w-px origin-left bg-gray-900", style: scaleStyle }),
            React.createElement("div", { className: "absolute right-0 h-full w-px origin-right bg-gray-900", style: scaleStyle }),
            React.createElement("div", { className: "origin-left pl-4 text-caption whitespace-nowrap", style: scaleStyle },
                React.createElement("div", { className: "flex items-center gap-x-4" },
                    React.createElement("p", null, `#${round.number} - ${Math.round((round.endTick - round.startTick) / ticksPerSecond)}s`),
                    hasComment && React.createElement(CommentDotsIcon, { className: "size-10" })),
                React.createElement("p", null, `${round.startTick}-${round.endTick}`)))));
}
//# sourceMappingURL=round-item.js.map