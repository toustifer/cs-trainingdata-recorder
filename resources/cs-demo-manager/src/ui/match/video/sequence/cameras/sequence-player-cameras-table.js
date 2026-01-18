import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { useTable } from 'csdm/ui/components/table/use-table';
import { Table } from 'csdm/ui/components/table/table';
import { Button } from 'csdm/ui/components/buttons/button';
import { InputNumber } from 'csdm/ui/components/inputs/number-input';
import { Select } from 'csdm/ui/components/inputs/select';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { useSequenceForm } from 'csdm/ui/match/video/sequence/use-sequence-form';
import { ManageCamerasButtons } from './manage-player-cameras-buttons';
function TickCell({ data }) {
    const { setCameraOnPlayerAtTick } = useSequenceForm();
    return (React.createElement(InputNumber, { defaultValue: data.tick, onBlur: (event) => {
            const newTick = Number.parseInt(event.target.value);
            if (Number.isNaN(newTick) || newTick === data.tick) {
                return;
            }
            setCameraOnPlayerAtTick({
                tick: newTick,
                playerSteamId: data.playerSteamId,
                oldTick: data.tick,
            });
        } }));
}
function PlayerNameCell({ rowIndex, data }) {
    const match = useCurrentMatch();
    const { sequence, setCameraOnPlayerAtTick } = useSequenceForm();
    const options = match.players
        .toSorted((playerA, playerB) => {
        return playerA.name.localeCompare(playerB.name);
    })
        .map((player) => {
        return {
            value: player.steamId,
            label: player.name,
        };
    });
    const isDisabled = options.length === 0;
    return (React.createElement(Select, { options: options, isDisabled: isDisabled, value: data.playerSteamId, onChange: (steamId) => {
            const currentCamera = sequence.playerCameras[rowIndex];
            if (!currentCamera) {
                return;
            }
            setCameraOnPlayerAtTick({
                tick: data.tick,
                playerSteamId: steamId,
                oldTick: currentCamera.tick,
            });
        } }));
}
function ActionsCell({ data }) {
    const { removeCameraAtTick } = useSequenceForm();
    return (React.createElement(Button, { onClick: () => {
            removeCameraAtTick(data.tick);
        } },
        React.createElement(Trans, { context: "Button" }, "Remove")));
}
function getRowId(row) {
    return `${row.tick}-${row.playerSteamId}`;
}
export function SequencePlayerCamerasTable() {
    const sequenceContext = useSequenceForm();
    const { sequence } = sequenceContext;
    const { t } = useLingui();
    const columns = [
        {
            id: 'tick',
            accessor: 'tick',
            headerText: t({
                context: 'Table header',
                message: 'Tick',
            }),
            headerTooltip: t({
                context: 'Table header tooltip',
                message: 'Tick',
            }),
            width: 130,
            Cell: TickCell,
            allowSort: false,
            allowResize: false,
            sortFunction: () => {
                return (cameraA, cameraB) => {
                    return cameraA.tick - cameraB.tick;
                };
            },
        },
        {
            id: 'player-name',
            accessor: 'playerName',
            headerText: t({
                context: 'Table header',
                message: 'Player',
            }),
            headerTooltip: t({
                context: 'Table header tooltip',
                message: 'Player',
            }),
            width: 200,
            Cell: PlayerNameCell,
            allowSort: false,
            allowMove: false,
        },
        {
            id: 'actions',
            accessor: 'playerSteamId',
            headerText: t({
                context: 'Table header',
                message: 'Actions',
            }),
            headerTooltip: t({
                context: 'Table header tooltip',
                message: 'Actions',
            }),
            width: 130,
            Cell: ActionsCell,
            allowSort: false,
            allowResize: false,
            allowMove: false,
        },
    ];
    const table = useTable({
        columns,
        data: sequence.playerCameras,
        getRowId,
        rowSelection: 'none',
        sortedColumn: { id: 'tick', direction: 'desc' },
    });
    const cameraCount = sequence.playerCameras.length;
    return (React.createElement("div", { className: "flex flex-col" },
        React.createElement("div", { className: "mb-4 flex items-center justify-between" },
            React.createElement("h2", null,
                React.createElement(Trans, null,
                    "Player cameras (",
                    React.createElement("strong", null, cameraCount),
                    ")")),
            React.createElement(ManageCamerasButtons, null)),
        React.createElement(Table, { table: table })));
}
//# sourceMappingURL=sequence-player-cameras-table.js.map