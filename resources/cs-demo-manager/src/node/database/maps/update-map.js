import { db } from 'csdm/node/database/database';
export async function updateMap(map) {
    if (!map.name) {
        throw new Error('Map name must be defined');
    }
    if (!map.game) {
        throw new Error('Map game must be defined');
    }
    if (!map.id) {
        throw new Error('Map ID must be defined');
    }
    const updatedMap = await db.updateTable('maps').set(map).where('id', '=', map.id).returningAll().execute();
    return updatedMap;
}
//# sourceMappingURL=update-map.js.map