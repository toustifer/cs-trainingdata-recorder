import { Sheet } from '../sheet';
export class MultipleMatchExportSheet extends Sheet {
    checksums;
    constructor(workbook, checksums) {
        super(workbook);
        this.checksums = checksums;
    }
}
//# sourceMappingURL=multiple-match-export-sheet.js.map