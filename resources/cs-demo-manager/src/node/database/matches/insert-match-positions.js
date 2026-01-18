import { getCsvFilePath, insertFromCsv } from './match-insertion';
async function insertPlayersPositions({ outputFolderPath, demoName, databaseSettings }) {
    const csvFilePath = getCsvFilePath(outputFolderPath, demoName, '_positions.csv');
    await insertFromCsv({
        databaseSettings,
        csvFilePath,
        tableName: 'player_positions',
        columns: [
            'frame',
            'tick',
            'is_alive',
            'x',
            'y',
            'z',
            'yaw',
            'flash_duration_remaining',
            'side',
            'money',
            'health',
            'armor',
            'has_helmet',
            'has_bomb',
            'has_defuse_kit',
            'is_ducking',
            'is_airborne',
            'is_scoping',
            'is_defusing',
            'is_planting',
            'is_grabbing_hostage',
            'active_weapon_name',
            'equipments',
            'grenades',
            'pistols',
            'smgs',
            'rifles',
            'heavy',
            'player_steam_id',
            'player_name',
            'round_number',
            'match_checksum',
        ],
    });
}
async function insertGrenadePositions({ outputFolderPath, demoName, databaseSettings }) {
    const csvFilePath = getCsvFilePath(outputFolderPath, demoName, '_grenade_positions.csv');
    await insertFromCsv({
        databaseSettings,
        tableName: 'grenade_positions',
        csvFilePath,
        columns: [
            'frame',
            'tick',
            'round_number',
            'grenade_id',
            'projectile_id',
            'grenade_name',
            'x',
            'y',
            'z',
            'thrower_steam_id',
            'thrower_name',
            'thrower_side',
            'thrower_team_name',
            'thrower_velocity_x',
            'thrower_velocity_y',
            'thrower_velocity_z',
            'thrower_yaw',
            'thrower_pitch',
            'match_checksum',
        ],
    });
}
async function insertInfernoPositions({ outputFolderPath, demoName, databaseSettings }) {
    const csvFilePath = getCsvFilePath(outputFolderPath, demoName, '_inferno_positions.csv');
    await insertFromCsv({
        databaseSettings,
        tableName: 'inferno_positions',
        csvFilePath,
        columns: [
            'frame',
            'tick',
            'round_number',
            'thrower_steam_id',
            'thrower_name',
            'unique_id',
            'x',
            'y',
            'z',
            'convex_hull_2d',
            'match_checksum',
        ],
    });
}
async function insertHostagePositions({ outputFolderPath, demoName, databaseSettings }) {
    const csvFilePath = getCsvFilePath(outputFolderPath, demoName, '_hostage_positions.csv');
    await insertFromCsv({
        databaseSettings,
        tableName: 'hostage_positions',
        csvFilePath,
        columns: ['frame', 'tick', 'round_number', 'x', 'y', 'z', 'state', 'match_checksum'],
    });
}
async function insertChickenPositions({ outputFolderPath, demoName, databaseSettings }) {
    const csvFilePath = getCsvFilePath(outputFolderPath, demoName, '_chicken_positions.csv');
    await insertFromCsv({
        databaseSettings,
        tableName: 'chicken_positions',
        csvFilePath,
        columns: ['frame', 'tick', 'round_number', 'x', 'y', 'z', 'match_checksum'],
    });
}
export async function insertMatchPositions({ demoName, outputFolderPath, databaseSettings, }) {
    await Promise.all([
        insertPlayersPositions({
            databaseSettings,
            outputFolderPath,
            demoName,
        }),
        insertGrenadePositions({
            databaseSettings,
            outputFolderPath,
            demoName,
        }),
        insertInfernoPositions({
            databaseSettings,
            outputFolderPath,
            demoName,
        }),
        insertHostagePositions({
            databaseSettings,
            outputFolderPath,
            demoName,
        }),
        insertChickenPositions({
            databaseSettings,
            outputFolderPath,
            demoName,
        }),
    ]);
}
//# sourceMappingURL=insert-match-positions.js.map