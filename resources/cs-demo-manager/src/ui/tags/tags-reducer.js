import { createReducer } from '@reduxjs/toolkit';
import { initializeAppSuccess } from 'csdm/ui/bootstrap/bootstrap-actions';
import { tagDeleted, tagInserted, tagUpdated } from './tags-actions';
const initialState = [];
export const tagsReducer = createReducer(initialState, (builder) => {
    builder
        .addCase(initializeAppSuccess, (state, action) => {
        return action.payload.tags;
    })
        .addCase(tagInserted, (state, action) => {
        state.push(action.payload.tag);
    })
        .addCase(tagUpdated, (state, action) => {
        const tagIndex = state.findIndex((tag) => tag.id === action.payload.tag.id);
        if (tagIndex > -1) {
            state[tagIndex] = action.payload.tag;
        }
    })
        .addCase(tagDeleted, (state, action) => {
        return state.filter((tag) => tag.id !== action.payload.tagId);
    });
});
//# sourceMappingURL=tags-reducer.js.map