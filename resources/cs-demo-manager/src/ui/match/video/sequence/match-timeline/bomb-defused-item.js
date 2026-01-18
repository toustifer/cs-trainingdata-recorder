import React from 'react';
import { Trans } from '@lingui/react/macro';
import { DefuserIcon } from 'csdm/ui/icons/weapons/defuser-icon';
import { ContextMenu } from 'csdm/ui/components/context-menu/context-menu';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
import { Separator } from 'csdm/ui/components/context-menu/separator';
import { useContextMenu } from 'csdm/ui/components/context-menu/use-context-menu';
import { scaleStyle } from 'csdm/ui/components/timeline/use-timeline';
import { Tooltip } from 'csdm/ui/components/tooltip';
import { SelectSecondsDialog } from './select-seconds-dialog';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { useSequenceForm } from '../use-sequence-form';
import { Tick } from './tick';
import { FocusCameraOnEventSubContextMenu } from './focus-camera-on-event-sub-context-menu';
function BombDefusedContextMenu({ bombDefused }) {
    const { sequence, setStartTick, setEndTick, setCameraOnPlayerAtTick } = useSequenceForm();
    const { showDialog } = useDialog();
    const showSelectSecondsDialog = (position, operation) => {
        showDialog(React.createElement(SelectSecondsDialog, { tick: bombDefused.tick, operation: operation, onSubmit: (tick) => {
                if (position === 'start') {
                    setStartTick(tick);
                }
                else {
                    setEndTick(tick);
                }
            } }));
    };
    const onSetAsStartTickClick = () => {
        setStartTick(bombDefused.tick);
    };
    const onSetAsStartTickMinusSecondsClick = () => {
        showSelectSecondsDialog('start', 'minus');
    };
    const onSetAsStartTickPlusSecondsClick = () => {
        showSelectSecondsDialog('start', 'plus');
    };
    const onSetAsEndTickClick = () => {
        setEndTick(bombDefused.tick);
    };
    const onSetAsEndTickMinusSecondsClick = () => {
        showSelectSecondsDialog('end', 'minus');
    };
    const onSetAsEndTickPlusSecondsClick = () => {
        showSelectSecondsDialog('end', 'plus');
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(ContextMenu, null,
            React.createElement(FocusCameraOnEventSubContextMenu, { eventTick: bombDefused.tick, startTick: Number(sequence.startTick), label: React.createElement(Trans, { context: "Context menu" }, "Focus camera on defuser"), onSubmit: (tick) => {
                    setCameraOnPlayerAtTick({
                        tick,
                        playerSteamId: bombDefused.defuserSteamId,
                    });
                } }),
            React.createElement(Separator, null),
            React.createElement(ContextMenuItem, { onClick: onSetAsStartTickClick },
                React.createElement(Trans, { context: "Context menu" }, "Set the tick of the bomb defused as start tick")),
            React.createElement(ContextMenuItem, { onClick: onSetAsStartTickMinusSecondsClick },
                React.createElement(Trans, { context: "Context menu" }, "Set the tick of the bomb defused minus X seconds as start tick")),
            React.createElement(ContextMenuItem, { onClick: onSetAsStartTickPlusSecondsClick },
                React.createElement(Trans, { context: "Context menu" }, "Set the tick of the bomb defused plus X seconds as start tick")),
            React.createElement(Separator, null),
            React.createElement(ContextMenuItem, { onClick: onSetAsEndTickClick },
                React.createElement(Trans, { context: "Context menu" }, "Set the tick of the bomb defused as end tick")),
            React.createElement(ContextMenuItem, { onClick: onSetAsEndTickMinusSecondsClick },
                React.createElement(Trans, { context: "Context menu" }, "Set the tick of the bomb defused minus X seconds as end tick")),
            React.createElement(ContextMenuItem, { onClick: onSetAsEndTickPlusSecondsClick },
                React.createElement(Trans, { context: "Context menu" }, "Set the tick of the bomb defused plus X seconds as end tick")))));
}
function TooltipContent({ bombDefused }) {
    const { tick, defuserName, site } = bombDefused;
    return (React.createElement("div", { className: "flex flex-col" },
        React.createElement(Tick, { tick: tick }),
        React.createElement("p", null,
            React.createElement(Trans, null,
                "Bomb defused by ",
                React.createElement("strong", null, defuserName),
                " on site ",
                React.createElement("strong", null, site)))));
}
export function BombDefusedItem({ iconSize, bombDefused }) {
    const { showContextMenu } = useContextMenu();
    const onContextMenu = (event) => {
        event.stopPropagation();
        showContextMenu(event.nativeEvent, React.createElement(BombDefusedContextMenu, { bombDefused: bombDefused }));
    };
    return (React.createElement(Tooltip, { content: React.createElement(TooltipContent, { bombDefused: bombDefused }), placement: "top", renderInPortal: true },
        React.createElement("div", { style: scaleStyle, onContextMenu: onContextMenu },
            React.createElement(DefuserIcon, { width: iconSize, height: iconSize, className: "text-ct" }))));
}
//# sourceMappingURL=bomb-defused-item.js.map