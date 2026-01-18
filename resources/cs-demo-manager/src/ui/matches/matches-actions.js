import { createAction } from '@reduxjs/toolkit';
export const fetchMatchesStart = createAction('matches/fetchStart');
export const fetchMatchesSuccess = createAction('matches/fetchSuccess');
export const fetchMatchesError = createAction('matches/fetchError');
export const selectedMatchesChanged = createAction('matches/selectionChanged');
export const deleteMatchesSuccess = createAction('matches/deleteSuccess');
export const fuzzySearchTextChanged = createAction('matches/fuzzySearchTextChanged');
export const matchesTypeUpdated = createAction('matches/typeUpdated');
export const teamNamesUpdated = createAction('matches/teamNamesUpdated');
//# sourceMappingURL=matches-actions.js.map