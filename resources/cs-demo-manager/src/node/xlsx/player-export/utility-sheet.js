import {} from 'csdm/node/database/players/fetch-players-utility-stats';
import { fetchPlayerUtilityStats } from 'csdm/node/database/player/fetch-player-utility-stats';
import { SinglePlayerExportSheet } from './single-player-export-sheet';
export class UtilitySheet extends SinglePlayerExportSheet {
    getName() {
        return 'Utility';
    }
    getColumns() {
        return [
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
        const stats = await fetchPlayerUtilityStats(this.steamId, this.filters);
        this.writeRow(stats);
    }
}
//# sourceMappingURL=utility-sheet.js.map