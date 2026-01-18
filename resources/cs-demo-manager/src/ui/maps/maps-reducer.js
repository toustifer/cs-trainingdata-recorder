import { createReducer } from '@reduxjs/toolkit';
import { initializeAppSuccess } from 'csdm/ui/bootstrap/bootstrap-actions';
import { addMapSuccess, deleteMapSuccess, resetMaps, updateMapSuccess } from './maps-actions';
function sortMapsByName(map1, map2) {
    return map1.name.localeCompare(map2.name);
}
const initialState = {
    entities: [],
    cacheTimestamp: Date.now(),
};
export const mapsReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(addMapSuccess, (state, action) => {
        state.entities.push(action.payload.map);
        state.entities.sort(sortMapsByName);
    })
        .addCase(deleteMapSuccess, (state, action) => {
        state.entities = state.entities.filter((map) => {
            return !action.payload.mapId.includes(map.id);
        });
    })
        .addCase(updateMapSuccess, (state, action) => {
        const mapIndex = state.entities.findIndex((map) => map.id === action.payload.map.id);
        if (mapIndex > -1) {
            state.entities[mapIndex] = action.payload.map;
            state.cacheTimestamp = Date.now();
        }
    })
        .addCase(initializeAppSuccess, (state, action) => {
        state.entities = action.payload.maps.sort(sortMapsByName);
    })
        .addCase(resetMaps, (state, action) => {
        state.entities = action.payload.maps;
    });
});
//# sourceMappingURL=maps-reducer.js.map