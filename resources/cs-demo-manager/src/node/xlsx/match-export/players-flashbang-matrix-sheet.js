import { fetchMatchFlashbangMatrixRows } from 'csdm/node/database/match/fetch-match-flashbang-matrix-rows';
import { SingleMatchExportSheet } from './single-match-export-sheet';
export class PlayersFlashbangMatrixSheet extends SingleMatchExportSheet {
    getName() {
        return 'Players Flashbang matrix';
    }
    getColumns() {
        return [];
    }
    async generate() {
        const rows = await fetchMatchFlashbangMatrixRows(this.match.checksum);
        const playerSteamIds = [];
        const playerNames = [];
        for (const row of rows) {
            if (!playerSteamIds.includes(row.flasherSteamId)) {
                playerSteamIds.push(row.flasherSteamId);
            }
            if (!playerNames.includes(row.flasherName)) {
                playerNames.push(row.flasherName);
            }
        }
        this.writeCells(['Flasher/Flashed', ...playerNames]);
        for (const flasherSteamId of playerSteamIds) {
            const flashedRows = rows.filter((row) => row.flasherSteamId === flasherSteamId);
            if (flashedRows.length === 0) {
                throw new Error(`No rows found for flasher with SteamID: ${flasherSteamId}`);
            }
            const flasherName = flashedRows[0].flasherName;
            const cells = [flasherName];
            for (const flashedSteamId of playerSteamIds) {
                const row = flashedRows.find((row) => row.flashedSteamId === flashedSteamId);
                if (!row) {
                    throw new Error(`No row found for flasher with SteamID: ${flasherSteamId} and flashed with SteamID: ${flashedSteamId}`);
                }
                cells.push(String(row.duration));
            }
            this.writeCells(cells);
        }
    }
}
//# sourceMappingURL=players-flashbang-matrix-sheet.js.map