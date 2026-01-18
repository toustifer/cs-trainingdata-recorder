import { Workbook } from '../workbook';
import { PlayersSheet } from './players-sheet';
import { PlayerSheetName } from '../player-sheet-name';
import { ClutchSheet } from './clutch-sheet';
import { EconomySheet } from './economy-sheet';
import { MapsSheet } from './maps-sheet';
import { RoundsSheet } from './rounds-sheet';
import { UtilitySheet } from './utility-sheet';
export class PlayersXlsxExport {
    options;
    workbook;
    constructor(options) {
        this.options = options;
        this.workbook = new Workbook();
    }
    async generate() {
        try {
            await this.workbook.initialize();
            const sheetMappings = [
                { name: PlayerSheetName.Players, sheetClass: PlayersSheet },
                { name: PlayerSheetName.Maps, sheetClass: MapsSheet },
                { name: PlayerSheetName.Rounds, sheetClass: RoundsSheet },
                { name: PlayerSheetName.Utility, sheetClass: UtilitySheet },
                { name: PlayerSheetName.Clutch, sheetClass: ClutchSheet },
                { name: PlayerSheetName.Economy, sheetClass: EconomySheet },
            ];
            for (const { name, sheetClass } of sheetMappings) {
                if (this.options.sheets[name]) {
                    this.options.onSheetGenerationStart?.(name);
                    const sheet = new sheetClass(this.workbook, this.options.steamIds);
                    await sheet.generate();
                }
            }
            await this.workbook.write(this.options.outputFilePath);
        }
        finally {
            await this.workbook.release();
        }
    }
}
//# sourceMappingURL=players-xlsx-export.js.map