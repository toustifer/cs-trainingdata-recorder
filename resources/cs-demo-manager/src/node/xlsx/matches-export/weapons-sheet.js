import { MultipleMatchExportSheet } from './multiple-match-export-sheet';
import { fetchWeaponsRows } from 'csdm/node/database/xlsx/fetch-weapons-rows';
export class WeaponsSheet extends MultipleMatchExportSheet {
    getName() {
        return 'Weapons';
    }
    getColumns() {
        return [
            {
                name: 'name',
                cellFormatter: (kill) => kill.weaponName,
            },
            {
                name: 'kill_count',
                cellFormatter: (row) => row.killCount,
            },
            {
                name: 'shot_count',
                cellFormatter: (row) => row.shotCount,
            },
            {
                name: 'hit_count',
                cellFormatter: (row) => row.hitCount,
            },
            {
                name: 'health_damage',
                cellFormatter: (row) => row.healthDamage,
            },
            {
                name: 'armor_damage',
                cellFormatter: (row) => row.armorDamage,
            },
        ];
    }
    async generate() {
        const rows = await fetchWeaponsRows(this.checksums);
        for (const row of rows) {
            this.writeRow(row);
        }
    }
}
//# sourceMappingURL=weapons-sheet.js.map