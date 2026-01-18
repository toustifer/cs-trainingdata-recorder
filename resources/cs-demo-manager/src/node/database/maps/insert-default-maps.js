import { getDefaultMaps } from './default-maps';
export async function insertDefaultMaps(transaction) {
    await transaction
        .insertInto('maps')
        .values(getDefaultMaps())
        .onConflict((oc) => oc.constraint('maps_name_game_unique').doNothing())
        .execute();
}
//# sourceMappingURL=insert-default-maps.js.map