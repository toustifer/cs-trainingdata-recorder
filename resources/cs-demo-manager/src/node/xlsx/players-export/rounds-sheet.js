import { MultiplePlayerExportSheet } from './multiple-player-export-sheet';
import { fetchPlayersRoundCountStats, } from 'csdm/node/database/players/fetch-players-round-count-stats';
export class RoundsSheet extends MultiplePlayerExportSheet {
    getName() {
        return 'Rounds';
    }
    getColumns() {
        return [
            {
                name: 'steam_id',
                cellFormatter: (row) => row.steamId,
            },
            {
                name: 'total_count',
                cellFormatter: (row) => row.totalCount,
            },
            {
                name: 'round_count_as_ct',
                cellFormatter: (row) => row.roundCountAsCt,
            },
            {
                name: 'round_count_as_t',
                cellFormatter: (row) => row.roundCountAsT,
            },
        ];
    }
    async generate() {
        const rows = await fetchPlayersRoundCountStats(this.steamIds);
        for (const row of rows) {
            this.writeRow(row);
        }
    }
}
//# sourceMappingURL=rounds-sheet.js.map