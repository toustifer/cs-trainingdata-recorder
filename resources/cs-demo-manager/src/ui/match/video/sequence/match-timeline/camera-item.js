import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ContextMenu } from 'csdm/ui/components/context-menu/context-menu';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
import { useContextMenu } from 'csdm/ui/components/context-menu/use-context-menu';
import { Tooltip } from 'csdm/ui/components/tooltip';
import { scaleStyle } from 'csdm/ui/components/timeline/use-timeline';
import { useSequenceForm } from '../use-sequence-form';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { getSequencePlayerColor } from '../get-sequence-player-color';
import { Tick } from './tick';
function CameraContextMenu({ tick }) {
    const { removeCameraAtTick } = useSequenceForm();
    return (React.createElement(React.Fragment, null,
        React.createElement(ContextMenu, null,
            React.createElement(ContextMenuItem, { onClick: () => {
                    removeCameraAtTick(tick);
                } },
                React.createElement(Trans, { context: "Context menu" }, "Remove")))));
}
function TooltipContent({ camera }) {
    const { tick, playerName } = camera;
    return (React.createElement("div", { className: "flex flex-col" },
        React.createElement(Tick, { tick: tick }),
        React.createElement("p", null,
            React.createElement(Trans, null,
                "Camera on ",
                React.createElement("strong", null, playerName)))));
}
export function PlayerCameraItem({ camera }) {
    const match = useCurrentMatch();
    const { showContextMenu } = useContextMenu();
    const onContextMenu = (event) => {
        event.stopPropagation();
        showContextMenu(event.nativeEvent, React.createElement(CameraContextMenu, { tick: camera.tick }));
    };
    const playerIndex = match.players.findIndex((player) => player.steamId === camera.playerSteamId);
    if (playerIndex === -1) {
        return null;
    }
    return (React.createElement(Tooltip, { content: React.createElement(TooltipContent, { camera: camera }), placement: "top", renderInPortal: true },
        React.createElement("div", { className: "size-12 rounded-full", style: {
                ...scaleStyle,
                backgroundColor: getSequencePlayerColor(playerIndex),
            }, onContextMenu: onContextMenu })));
}
//# sourceMappingURL=camera-item.js.map