import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ContextMenu } from 'csdm/ui/components/context-menu/context-menu';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
import { Separator } from 'csdm/ui/components/context-menu/separator';
import { useContextMenu } from 'csdm/ui/components/context-menu/use-context-menu';
import { scaleStyle } from 'csdm/ui/components/timeline/use-timeline';
import { Tooltip } from 'csdm/ui/components/tooltip';
import { SelectSecondsDialog } from './select-seconds-dialog';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { BombIcon } from 'csdm/ui/icons/weapons/bomb-icon';
import { useSequenceForm } from '../use-sequence-form';
import { Tick } from './tick';
import { FocusCameraOnEventSubContextMenu } from './focus-camera-on-event-sub-context-menu';
function BombPlantedContextMenu({ bombPlanted }) {
    const { sequence, setStartTick, setEndTick, setCameraOnPlayerAtTick } = useSequenceForm();
    const { showDialog } = useDialog();
    const showSelectSecondsDialog = (position, operation) => {
        showDialog(React.createElement(SelectSecondsDialog, { tick: bombPlanted.tick, operation: operation, onSubmit: (tick) => {
                if (position === 'start') {
                    setStartTick(tick);
                }
                else {
                    setEndTick(tick);
                }
            } }));
    };
    const onSetAsStartTickClick = () => {
        setStartTick(bombPlanted.tick);
    };
    const onSetAsStartTickMinusSecondsClick = () => {
        showSelectSecondsDialog('start', 'minus');
    };
    const onSetAsStartTickPlusSecondsClick = () => {
        showSelectSecondsDialog('start', 'plus');
    };
    const onSetAsEndTickClick = () => {
        setEndTick(bombPlanted.tick);
    };
    const onSetAsEndTickMinusSecondsClick = () => {
        showSelectSecondsDialog('end', 'minus');
    };
    const onSetAsEndTickPlusSecondsClick = () => {
        showSelectSecondsDialog('end', 'plus');
    };
    return (React.createElement(React.Fragment, null,
        React.createElement(ContextMenu, null,
            React.createElement(FocusCameraOnEventSubContextMenu, { eventTick: bombPlanted.tick, startTick: Number(sequence.startTick), label: React.createElement(Trans, { context: "Context menu" }, "Focus camera on planter"), onSubmit: (tick) => {
                    setCameraOnPlayerAtTick({
                        tick,
                        playerSteamId: bombPlanted.planterSteamId,
                    });
                } }),
            React.createElement(Separator, null),
            React.createElement(ContextMenuItem, { onClick: onSetAsStartTickClick },
                React.createElement(Trans, { context: "Context menu" }, "Set the tick of the bomb planted as start tick")),
            React.createElement(ContextMenuItem, { onClick: onSetAsStartTickMinusSecondsClick },
                React.createElement(Trans, { context: "Context menu" }, "Set the tick of the bomb planted minus X seconds as start tick")),
            React.createElement(ContextMenuItem, { onClick: onSetAsStartTickPlusSecondsClick },
                React.createElement(Trans, { context: "Context menu" }, "Set the tick of the bomb planted plus X seconds as start tick")),
            React.createElement(Separator, null),
            React.createElement(ContextMenuItem, { onClick: onSetAsEndTickClick },
                React.createElement(Trans, { context: "Context menu" }, "Set the tick of the bomb planted as end tick")),
            React.createElement(ContextMenuItem, { onClick: onSetAsEndTickMinusSecondsClick },
                React.createElement(Trans, { context: "Context menu" }, "Set the tick of the bomb planted minus X seconds as end tick")),
            React.createElement(ContextMenuItem, { onClick: onSetAsEndTickPlusSecondsClick },
                React.createElement(Trans, { context: "Context menu" }, "Set the tick of the bomb planted plus X seconds as end tick")))));
}
function TooltipContent({ bombPlanted }) {
    const { tick, planterName, site } = bombPlanted;
    return (React.createElement("div", { className: "flex flex-col" },
        React.createElement(Tick, { tick: tick }),
        React.createElement("p", null,
            React.createElement(Trans, { context: "Tooltip" },
                "Bomb planted by ",
                React.createElement("strong", null, planterName),
                " on site ",
                React.createElement("strong", null, site)))));
}
export function BombPlantedItem({ iconSize, bombPlanted }) {
    const { showContextMenu } = useContextMenu();
    const onContextMenu = (event) => {
        event.stopPropagation();
        showContextMenu(event.nativeEvent, React.createElement(BombPlantedContextMenu, { bombPlanted: bombPlanted }));
    };
    return (React.createElement(Tooltip, { content: React.createElement(TooltipContent, { bombPlanted: bombPlanted }), placement: "top", renderInPortal: true },
        React.createElement("div", { style: scaleStyle, onContextMenu: onContextMenu },
            React.createElement(BombIcon, { size: iconSize, className: "fill-red-700" }))));
}
//# sourceMappingURL=bomb-planted-item.js.map