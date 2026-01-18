import { createReducer } from '@reduxjs/toolkit';
import { Status } from 'csdm/common/types/status';
import { fetchTeamsError, fetchTeamsStart, fetchTeamsSuccess, fuzzySearchTextChanged, selectionChanged, } from './teams-actions';
const initialState = {
    status: Status.Loading,
    entities: [],
    selectedTeamNames: [],
    fuzzySearchText: '',
};
export const teamsReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(fetchTeamsStart, (state) => {
        state.status = Status.Loading;
        state.entities = [];
    })
        .addCase(fetchTeamsSuccess, (state, action) => {
        state.status = Status.Success;
        state.entities = action.payload.teams;
    })
        .addCase(fetchTeamsError, (state) => {
        state.status = Status.Error;
    })
        .addCase(selectionChanged, (state, action) => {
        state.selectedTeamNames = action.payload.names;
    })
        .addCase(fuzzySearchTextChanged, (state, action) => {
        state.fuzzySearchText = action.payload.text;
    });
});
//# sourceMappingURL=teams-reducer.js.map