import { SingleMatchExportSheet } from './single-match-export-sheet';
import { fetchWeaponsRows } from 'csdm/node/database/xlsx/fetch-weapons-rows';
export class WeaponsSheet extends SingleMatchExportSheet {
    getName() {
        return 'Weapons';
    }
    getColumns() {
        return [
            {
                name: 'weapon_name',
                cellFormatter: (row) => row.weaponName,
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
        const rows = await fetchWeaponsRows([this.match.checksum]);
        for (const row of rows) {
            this.writeRow(row);
        }
    }
}
//# sourceMappingURL=weapons-sheet.js.map