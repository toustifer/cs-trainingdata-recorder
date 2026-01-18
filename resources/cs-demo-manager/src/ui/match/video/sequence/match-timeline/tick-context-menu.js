import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ContextMenu } from 'csdm/ui/components/context-menu/context-menu';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
import { useSequenceForm } from '../use-sequence-form';
import { SubContextMenu } from 'csdm/ui/components/context-menu/sub-context-menu';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { getSequencePlayerColor } from '../get-sequence-player-color';
import { useCameras } from 'csdm/ui/cameras/use-cameras';
export function TickContextMenu({ tick }) {
    const { setStartTick, setEndTick, setCameraAtTick, setCameraOnPlayerAtTick } = useSequenceForm();
    const match = useCurrentMatch();
    const cameras = useCameras(match.game, match.mapName);
    return (React.createElement(ContextMenu, null,
        React.createElement(SubContextMenu, { label: React.createElement(Trans, { context: "Context menu" },
                "Set tick ",
                tick,
                " as") },
            React.createElement(ContextMenuItem, { onClick: () => {
                    setStartTick(tick);
                } },
                React.createElement(Trans, { context: "Context menu" }, "Start tick")),
            React.createElement(ContextMenuItem, { onClick: () => {
                    setEndTick(tick);
                } },
                React.createElement(Trans, { context: "Context menu" }, "End tick"))),
        React.createElement(SubContextMenu, { label: React.createElement(Trans, { context: "Context menu" }, "Focus camera") }, match.players.map((player, index) => {
            return (React.createElement(ContextMenuItem, { key: player.steamId, onClick: () => {
                    setCameraOnPlayerAtTick({
                        tick,
                        playerSteamId: player.steamId,
                    });
                } },
                React.createElement("div", { className: "flex items-center gap-x-12" },
                    React.createElement("div", { className: "size-12 rounded-full", style: { backgroundColor: getSequencePlayerColor(index) } }),
                    React.createElement("span", null, player.name))));
        })),
        cameras.length > 0 && (React.createElement(SubContextMenu, { label: React.createElement(Trans, { context: "Context menu" }, "Set camera") }, cameras.map((camera) => {
            return (React.createElement(ContextMenuItem, { key: camera.id, onClick: () => {
                    setCameraAtTick({
                        tick,
                        cameraId: camera.id,
                    });
                } },
                React.createElement("div", { className: "flex items-center gap-x-12" },
                    React.createElement("div", { className: "size-12 rounded-full", style: { backgroundColor: camera.color } }),
                    React.createElement("p", { className: "max-w-[300px] truncate", title: camera.name }, camera.name))));
        })))));
}
//# sourceMappingURL=tick-context-menu.js.map