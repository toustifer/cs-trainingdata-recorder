import { fetchMatchesByChecksums } from 'csdm/node/database/matches/fetch-matches-by-checksums';
import { GeneralSheet } from './match-export/general-sheet';
import { KillsSheet } from './match-export/kills-sheet';
import { PlayersSheet } from './match-export/players-sheet';
import { RoundsSheet } from './match-export/rounds-sheet';
import { SheetName } from './sheet-name';
import { Workbook } from './workbook';
import { WeaponsSheet } from './match-export/weapons-sheet';
import { PlayersFlashbangMatrixSheet } from './match-export/players-flashbang-matrix-sheet';
import { CLutchesSheet } from './match-export/clutches-sheet';
export class MatchXlsxExport {
    workbook;
    options;
    constructor(options) {
        this.options = options;
        this.workbook = new Workbook();
    }
    async generate() {
        try {
            await this.workbook.initialize();
            const [match] = await fetchMatchesByChecksums([this.options.checksum]);
            if (this.options.sheets[SheetName.General]) {
                const sheet = new GeneralSheet(this.workbook, match);
                sheet.generate();
            }
            if (this.options.sheets[SheetName.Rounds]) {
                const sheet = new RoundsSheet(this.workbook, match);
                sheet.generate();
            }
            if (this.options.sheets[SheetName.Players]) {
                const sheet = new PlayersSheet(this.workbook, match);
                sheet.generate();
            }
            if (this.options.sheets[SheetName.Kills]) {
                const sheet = new KillsSheet(this.workbook, match);
                sheet.generate();
            }
            if (this.options.sheets[SheetName.Weapons]) {
                const sheet = new WeaponsSheet(this.workbook, match);
                await sheet.generate();
            }
            if (this.options.sheets[SheetName.PlayersFlashbangMatrix]) {
                const sheet = new PlayersFlashbangMatrixSheet(this.workbook, match);
                await sheet.generate();
            }
            if (this.options.sheets[SheetName.Clutches]) {
                const sheet = new CLutchesSheet(this.workbook, match);
                sheet.generate();
            }
            await this.workbook.write(this.options.outputFilePath);
        }
        finally {
            await this.workbook.release();
        }
    }
}
//# sourceMappingURL=match-xlsx-export.js.map