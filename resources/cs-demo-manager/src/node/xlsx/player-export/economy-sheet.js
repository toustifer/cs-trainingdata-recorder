import { fetchPlayersEconomyStats, } from 'csdm/node/database/players/fetch-players-economy-stats';
import { roundNumber } from 'csdm/common/math/round-number';
import { SinglePlayerExportSheet } from './single-player-export-sheet';
export class EconomySheet extends SinglePlayerExportSheet {
    getName() {
        return 'Economy';
    }
    getColumns() {
        return [
            {
                name: 'avg_money_spent_per_round',
                cellFormatter: (row) => roundNumber(row.averageMoneySpentPerRound),
            },
            {
                name: 'eco_count',
                cellFormatter: (row) => row.ecoCount,
            },
            {
                name: 'semi_eco_count',
                cellFormatter: (row) => row.semiEcoCount,
            },
            {
                name: 'force_buy_count',
                cellFormatter: (row) => row.forceBuyCount,
            },
            {
                name: 'full_buy_count',
                cellFormatter: (row) => row.fullBuyCount,
            },
        ];
    }
    async generate() {
        const rows = await fetchPlayersEconomyStats([this.steamId], this.filters);
        for (const row of rows) {
            this.writeRow(row);
        }
    }
}
//# sourceMappingURL=economy-sheet.js.map