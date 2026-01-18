import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { useTable } from 'csdm/ui/components/table/use-table';
import { Table } from 'csdm/ui/components/table/table';
import { Button } from 'csdm/ui/components/buttons/button';
import { InputNumber } from 'csdm/ui/components/inputs/number-input';
import { useSequenceForm } from 'csdm/ui/match/video/sequence/use-sequence-form';
import { ManageCustomCamerasButtons } from './manage-custom-cameras-buttons';
function TickCell({ data }) {
    const { setCameraAtTick } = useSequenceForm();
    return (React.createElement(InputNumber, { defaultValue: data.tick, onBlur: (event) => {
            const newTick = Number.parseInt(event.target.value);
            if (Number.isNaN(newTick) || newTick === data.tick) {
                return;
            }
            setCameraAtTick({
                tick: newTick,
                cameraId: data.id,
                oldTick: data.tick,
            });
        } }));
}
function NameCell({ data }) {
    return (React.createElement("div", { className: "flex items-center gap-x-8" },
        React.createElement("div", { className: "size-8 shrink-0 rounded-full", style: { backgroundColor: data.color } }),
        React.createElement("p", { className: "truncate", title: data.name }, data.name)));
}
function ActionsCell({ data }) {
    const { removeCameraAtTick } = useSequenceForm();
    return (React.createElement(Button, { onClick: () => {
            removeCameraAtTick(data.tick);
        } },
        React.createElement(Trans, { context: "Button" }, "Remove")));
}
function getRowId(row) {
    return `${row.tick}-${row.id}`;
}
export function SequenceCustomCamerasTable() {
    const { sequence } = useSequenceForm();
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
            id: 'camera-name',
            accessor: 'name',
            Cell: NameCell,
            headerText: t({
                context: 'Table header',
                message: 'Name',
            }),
            headerTooltip: t({
                context: 'Table header tooltip',
                message: 'Name',
            }),
            width: 200,
            allowSort: false,
            allowMove: false,
        },
        {
            id: 'actions',
            accessor: 'id',
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
        data: sequence.cameras,
        getRowId,
        rowSelection: 'none',
        sortedColumn: { id: 'tick', direction: 'desc' },
    });
    const cameraCount = sequence.cameras.length;
    return (React.createElement("div", { className: "flex flex-col" },
        React.createElement("div", { className: "mb-4 flex items-center justify-between" },
            React.createElement("h2", null,
                React.createElement(Trans, null,
                    "Custom cameras (",
                    React.createElement("strong", null, cameraCount),
                    ")")),
            React.createElement(ManageCustomCamerasButtons, null)),
        React.createElement(Table, { table: table })));
}
//# sourceMappingURL=sequence-custom-cameras-table.js.map