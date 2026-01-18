import { createAction } from '@reduxjs/toolkit';
export const fetchLastMatchesStart = createAction('downloads/valve/fetchLastMatchesStart');
export const fetchLastMatchesSuccess = createAction('downloads/valve/fetchLastMatchesSuccess');
export const fetchLastMatchesError = createAction('downloads/valve/fetchLastMatchesError');
export const currentSteamIdDetected = createAction('downloads/valve/currentSteamIdDetected');
export const matchSelected = createAction('downloads/valve/matchSelected');
export const steamIdSelected = createAction('downloads/valve/steamIdSelected');
//# sourceMappingURL=valve-actions.js.map