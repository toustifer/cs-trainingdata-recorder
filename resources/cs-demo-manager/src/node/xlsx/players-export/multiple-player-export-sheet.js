import { Sheet } from '../sheet';
export class MultiplePlayerExportSheet extends Sheet {
    steamIds;
    constructor(workbook, steamIds) {
        super(workbook);
        this.steamIds = steamIds;
    }
}
//# sourceMappingURL=multiple-player-export-sheet.js.map