import { createAction } from '@reduxjs/toolkit';
export const fetchPlayerStart = createAction('player/fetchStart');
export const fetchPlayerSuccess = createAction('player/fetchSuccess');
export const fetchPlayerError = createAction('player/fetchError');
export const selectedMatchesChanged = createAction('player/selectedMatchesChanged');
export const playerCommentUpdated = createAction('player/commentUpdated');
export const steamAccountNameUpdated = createAction('matches/steamAccountNameUpdated');
//# sourceMappingURL=player-actions.js.map