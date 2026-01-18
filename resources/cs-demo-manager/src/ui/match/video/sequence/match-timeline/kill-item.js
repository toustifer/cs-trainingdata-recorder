import React from 'react';
import { Trans } from '@lingui/react/macro';
import { EliminationIcon } from 'csdm/ui/icons/elimination-icon';
import { ContextMenu } from 'csdm/ui/components/context-menu/context-menu';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
import { Separator } from 'csdm/ui/components/context-menu/separator';
import { useContextMenu } from 'csdm/ui/components/context-menu/use-context-menu';
import { Tooltip } from 'csdm/ui/components/tooltip';
import { SelectSecondsDialog } from './select-seconds-dialog';
import { scaleStyle } from 'csdm/ui/components/timeline/use-timeline';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { useSequenceForm } from '../use-sequence-form';
import { KillFeedEntry } from 'csdm/ui/components/kill-feed-entry';
import { Tick } from './tick';
import { FocusCameraOnEventSubContextMenu } from './focus-camera-on-event-sub-context-menu';
function KillContextMenu({ kill }) {
    const { sequence, setCameraOnPlayerAtTick, setStartTick, setEndTick } = useSequenceForm();
    const { showDialog } = useDialog();
    const onSetAsStartTickClick = () => {
        setStartTick(kill.tick);
    };
    const showSelectSequenceBoundarySecondsDialog = (position, operation) => {
        showDialog(React.createElement(SelectSecondsDialog, { tick: kill.tick, operation: operation, onSubmit: (tick) => {
                if (position === 'start') {
                    setStartTick(tick);
                }
                else {
                    setEndTick(tick);
                }
            } }));
    };
    const onSetAsStartTickMinusSecondsClick = () => {
        showSelectSequenceBoundarySecondsDialog('start', 'minus');
    };
    const onSetAsStartTickPlusSecondsClick = () => {
        showSelectSequenceBoundarySecondsDialog('start', 'plus');
    };
    const onSetAsEndTickClick = () => {
        setEndTick(kill.tick);
    };
    const onSetAsEndTickMinusSecondsClick = () => {
        showSelectSequenceBoundarySecondsDialog('end', 'minus');
    };
    const onSetAsEndTickPlusSecondsClick = () => {
        showSelectSequenceBoundarySecondsDialog('end', 'plus');
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(ContextMenu, null,
            React.createElement(FocusCameraOnEventSubContextMenu, { eventTick: kill.tick, startTick: Number(sequence.startTick), label: React.createElement(Trans, { context: "Context menu" }, "Focus camera on killer"), onSubmit: (tick) => {
                    setCameraOnPlayerAtTick({
                        tick,
                        playerSteamId: kill.killerSteamId,
                    });
                } }),
            React.createElement(FocusCameraOnEventSubContextMenu, { eventTick: kill.tick, startTick: Number(sequence.startTick), label: React.createElement(Trans, { context: "Context menu" }, "Focus camera on victim"), onSubmit: (tick) => {
                    setCameraOnPlayerAtTick({
                        tick,
                        playerSteamId: kill.victimSteamId,
                    });
                } }),
            React.createElement(Separator, null),
            React.createElement(ContextMenuItem, { onClick: onSetAsStartTickClick },
                React.createElement(Trans, { context: "Context menu" }, "Set the tick of the kill as start tick")),
            React.createElement(ContextMenuItem, { onClick: onSetAsStartTickMinusSecondsClick },
                React.createElement(Trans, { context: "Context menu" }, "Set the tick of the kill minus X seconds as start tick")),
            React.createElement(ContextMenuItem, { onClick: onSetAsStartTickPlusSecondsClick },
                React.createElement(Trans, { context: "Context menu" }, "Set the tick of the kill plus X seconds as start tick")),
            React.createElement(Separator, null),
            React.createElement(ContextMenuItem, { onClick: onSetAsEndTickClick },
                React.createElement(Trans, { context: "Context menu" }, "Set the tick of the kill as end tick")),
            React.createElement(ContextMenuItem, { onClick: onSetAsEndTickMinusSecondsClick },
                React.createElement(Trans, { context: "Context menu" }, "Set the tick of the kill minus X seconds as end tick")),
            React.createElement(ContextMenuItem, { onClick: onSetAsEndTickPlusSecondsClick },
                React.createElement(Trans, { context: "Context menu" }, "Set the tick of the kill plus X seconds as end tick")))));
}
function TooltipContent({ kill }) {
    return (React.createElement("div", { className: "flex flex-col" },
        React.createElement(Tick, { tick: kill.tick }),
        React.createElement(KillFeedEntry, { kill: kill })));
}
export function KillItem({ kill, iconSize }) {
    const { showContextMenu } = useContextMenu();
    const onContextMenu = (event) => {
        event.stopPropagation();
        showContextMenu(event.nativeEvent, React.createElement(KillContextMenu, { kill: kill }));
    };
    return (React.createElement(Tooltip, { content: React.createElement(TooltipContent, { kill: kill }), placement: "top", renderInPortal: true },
        React.createElement("div", { style: scaleStyle, onContextMenu: onContextMenu },
            React.createElement(EliminationIcon, { className: "fill-gray-900", width: iconSize, height: iconSize }))));
}
//# sourceMappingURL=kill-item.js.map