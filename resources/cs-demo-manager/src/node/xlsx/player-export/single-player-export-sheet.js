import { Sheet } from '../sheet';
export class SinglePlayerExportSheet extends Sheet {
    steamId;
    filters;
    constructor(workbook, steamId, filters) {
        super(workbook);
        this.steamId = steamId;
        this.filters = filters;
    }
}
//# sourceMappingURL=single-player-export-sheet.js.map