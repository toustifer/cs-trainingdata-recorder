import { Sheet } from '../sheet';
export class SingleMatchExportSheet extends Sheet {
    match;
    constructor(workbook, match) {
        super(workbook);
        this.match = match;
    }
}
//# sourceMappingURL=single-match-export-sheet.js.map