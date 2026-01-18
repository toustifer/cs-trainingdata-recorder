import { createAction } from '@reduxjs/toolkit';
export const fetchTeamsStart = createAction('teams/fetchStart');
export const fetchTeamsSuccess = createAction('teams/fetchSuccess');
export const fetchTeamsError = createAction('teams/fetchError');
export const selectionChanged = createAction('teams/selectionChanged');
export const fuzzySearchTextChanged = createAction('teams/fuzzySearchTextChanged');
//# sourceMappingURL=teams-actions.js.map