import { useDemosTable } from './table/use-demos-table';
export function useSelectedDemos() {
    const table = useDemosTable();
    return table.getSelectedRows();
}
//# sourceMappingURL=use-selected-demos.js.map