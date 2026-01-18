import React, { useRef } from 'react';
import { GrenadeNameSelect } from './grenade-name-select';
import { useFilteredGrenadesThrow } from './use-filtered-grenades-throw';
import { FinderRoundsSelect } from './rounds-select';
import { FinderPlayerSelect } from './players-select';
import { useBuildGrenadeDrawings } from './drawing/build-grenade-drawings';
import { drawGrenadeDrawings } from './drawing/draw-grenade-drawings';
import { GrenadesFinderContextMenu } from './context-menu';
import { FinderSideSelect } from './side-select';
import { useCounterStrike } from 'csdm/ui/hooks/use-counter-strike';
import { CounterStrikeRunningDialog } from 'csdm/ui/components/dialogs/counter-strike-running-dialog';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { useContextMenu } from 'csdm/ui/components/context-menu/use-context-menu';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { Table } from 'csdm/ui/components/table/table';
import { useTable } from 'csdm/ui/components/table/use-table';
import { useGrenadesFinderColumns } from './use-grenades-finder-columns';
import { useMapCanvas } from 'csdm/ui/hooks/use-map-canvas';
function getRowId(grenadeThrow) {
    return grenadeThrow.id;
}
export function GrenadesFinder({ map, grenadesThrow }) {
    const match = useCurrentMatch();
    const { watchDemo, isKillCsRequired } = useCounterStrike();
    const { showDialog } = useDialog();
    const { showContextMenu } = useContextMenu();
    const hoveredIdRef = useRef(undefined);
    const filteredGrenadesThrow = useFilteredGrenadesThrow(grenadesThrow);
    const buildGrenadeDrawings = useBuildGrenadeDrawings();
    const { setCanvas, interactiveCanvas } = useMapCanvas({
        map,
        game: match.game,
        draw: async (interactiveCanvas, context) => {
            const drawings = await buildGrenadeDrawings(filteredGrenadesThrow, selectedGrenadeThrow?.id, interactiveCanvas);
            drawGrenadeDrawings(drawings, context, interactiveCanvas, hoveredIdRef);
        },
        onClick: () => {
            if (hoveredIdRef.current) {
                table.selectRow(hoveredIdRef.current);
                table.scrollToRow(hoveredIdRef.current);
            }
            else {
                table.deselectAll();
            }
        },
        onContextMenu: (event) => {
            if (hoveredIdRef.current === undefined) {
                return;
            }
            table.selectRow(hoveredIdRef.current);
            table.scrollToRow(hoveredIdRef.current);
            const grenadeThrow = filteredGrenadesThrow.find((grenade) => {
                return grenade.id === hoveredIdRef.current;
            });
            showContextMenu(event, React.createElement(GrenadesFinderContextMenu, { grenadeThrow: grenadeThrow, onWatchClick: onWatchClick }));
        },
    });
    const { canvasSize, setWrapper } = interactiveCanvas;
    const watchGrenadeThrow = () => {
        if (selectedGrenadeThrow === undefined) {
            return;
        }
        watchDemo({
            demoPath: match.demoFilePath,
            startTick: selectedGrenadeThrow.tick - match.tickrate * 5,
            focusSteamId: selectedGrenadeThrow.throwerSteamId,
        });
    };
    const onWatchClick = async () => {
        const shouldKillCs = await isKillCsRequired();
        if (shouldKillCs) {
            showDialog(React.createElement(CounterStrikeRunningDialog, { onConfirmClick: watchGrenadeThrow }));
        }
        else {
            watchGrenadeThrow();
        }
    };
    const onContextMenu = (event, table) => {
        const grenadesThrow = table.getSelectedRows();
        if (grenadesThrow.length > 0) {
            showContextMenu(event, React.createElement(GrenadesFinderContextMenu, { grenadeThrow: grenadesThrow[0], onWatchClick: onWatchClick }));
        }
    };
    const columns = useGrenadesFinderColumns();
    const table = useTable({
        data: filteredGrenadesThrow,
        columns,
        getRowId,
        rowSelection: 'single',
        onContextMenu,
    });
    const selectedGrenadeThrow = table.getSelectedRows()[0] ?? undefined;
    return (React.createElement("div", { className: "flex h-full" },
        React.createElement("div", { className: "mr-12 flex max-w-[488px] flex-1 flex-col gap-y-12" },
            React.createElement(GrenadeNameSelect, null),
            React.createElement(FinderRoundsSelect, null),
            React.createElement(FinderPlayerSelect, null),
            React.createElement(FinderSideSelect, null),
            React.createElement(Table, { table: table })),
        React.createElement("div", { className: "relative flex flex-1 bg-gray-50", ref: setWrapper },
            React.createElement("div", { className: "absolute top-0 size-full overflow-hidden" },
                React.createElement("canvas", { ref: (el) => setCanvas(el), width: canvasSize.width, height: canvasSize.height })))));
}
//# sourceMappingURL=grenades-finder.js.map