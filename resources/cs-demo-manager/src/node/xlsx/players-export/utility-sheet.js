import { fetchPlayersUtilityStats, } from 'csdm/node/database/players/fetch-players-utility-stats';
import { MultiplePlayerExportSheet } from './multiple-player-export-sheet';
export class UtilitySheet extends MultiplePlayerExportSheet {
    getName() {
        return 'Utility';
    }
    getColumns() {
        return [
            {
                name: 'steam_id',
                cellFormatter: (row) => row.steamId,
            },
            {
                name: 'avg_blind_time',
                cellFormatter: (row) => row.averageBlindTime,
            },
            {
                name: 'avg_enemies_flashed',
                cellFormatter: (row) => row.averageEnemiesFlashed,
            },
            {
                name: 'avg_he_grenade_damage',
                cellFormatter: (row) => row.averageHeGrenadeDamage,
            },
            {
                name: 'avg_smokes_thrown_per_match',
                cellFormatter: (row) => row.averageSmokesThrownPerMatch,
            },
        ];
    }
    async generate() {
        const rows = await fetchPlayersUtilityStats(this.steamIds);
        for (const row of rows) {
            this.writeRow(row);
        }
    }
}
//# sourceMappingURL=utility-sheet.js.map