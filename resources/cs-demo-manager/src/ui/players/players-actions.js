import { createAction } from '@reduxjs/toolkit';
export const fetchPlayersStart = createAction('players/fetchStart');
export const fetchPlayersSuccess = createAction('players/fetchSuccess');
export const fetchPlayersError = createAction('players/fetchError');
export const selectionChanged = createAction('players/selectionChanged');
export const fuzzySearchTextChanged = createAction('players/fuzzySearchTextChanged');
//# sourceMappingURL=players-actions.js.map