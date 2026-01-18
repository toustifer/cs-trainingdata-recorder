import { createReducer } from '@reduxjs/toolkit';
import { Status } from 'csdm/common/types/status';
import { fetchPlayersError, fetchPlayersStart, fetchPlayersSuccess, fuzzySearchTextChanged, selectionChanged, } from './players-actions';
import { playerCommentUpdated, steamAccountNameUpdated } from '../player/player-actions';
import { playersTagsUpdated } from '../tags/tags-actions';
const initialState = {
    status: Status.Loading,
    entities: [],
    selectedPlayerSteamIds: [],
    fuzzySearchText: '',
};
export const playersReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(fetchPlayersStart, (state) => {
        state.status = Status.Loading;
        state.entities = [];
    })
        .addCase(fetchPlayersSuccess, (state, action) => {
        state.status = Status.Success;
        state.entities = action.payload.players;
    })
        .addCase(fetchPlayersError, (state) => {
        state.status = Status.Error;
    })
        .addCase(selectionChanged, (state, action) => {
        state.selectedPlayerSteamIds = action.payload.steamIds;
    })
        .addCase(fuzzySearchTextChanged, (state, action) => {
        state.fuzzySearchText = action.payload.text;
    })
        .addCase(playerCommentUpdated, (state, action) => {
        const player = state.entities.find((p) => p.steamId === action.payload.steamId);
        if (player) {
            player.comment = action.payload.comment;
        }
    })
        .addCase(playersTagsUpdated, (state, action) => {
        const players = state.entities.filter((player) => {
            return action.payload.steamIds.includes(player.steamId);
        });
        for (const player of players) {
            player.tagIds = action.payload.tagIds;
        }
    })
        .addCase(steamAccountNameUpdated, (state, action) => {
        const player = state.entities.find((p) => p.steamId === action.payload.steamId);
        if (player) {
            player.name = action.payload.name;
        }
    });
});
//# sourceMappingURL=players-reducer.js.map