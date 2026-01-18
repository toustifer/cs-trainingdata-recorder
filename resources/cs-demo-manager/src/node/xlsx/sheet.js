export class Sheet {
    workbook;
    constructor(workbook) {
        this.workbook = workbook;
        this.workbook.addSheet(this.getName());
        const columnNames = this.getColumns().map((column) => column.name);
        if (columnNames.length > 0) {
            this.workbook.addRowToSheet(this.getName(), columnNames);
        }
    }
    writeRow(row) {
        const cells = [];
        for (const column of this.getColumns()) {
            cells.push(column.cellFormatter(row));
        }
        this.workbook.addRowToSheet(this.getName(), cells);
    }
    writeCells(cells) {
        this.workbook.addRowToSheet(this.getName(), cells);
    }
}
//# sourceMappingURL=sheet.js.map