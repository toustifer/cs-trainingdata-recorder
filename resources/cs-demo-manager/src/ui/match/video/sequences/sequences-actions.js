import { createAction } from '@reduxjs/toolkit';
export const addSequence = createAction('match/video/sequences/add');
export const updateSequence = createAction('match/video/sequences/update');
export const deleteSequence = createAction('match/video/sequences/delete');
export const replaceSequences = createAction('match/video/sequences/replace');
export const deleteSequences = createAction('match/video/sequences/deleteAll');
export const generatePlayersKillsSequences = createAction('match/video/sequences/generatePlayersKills');
export const generatePlayersDeathsSequences = createAction('match/video/sequences/generatePlayersDeaths');
export const generatePlayersRoundsSequences = createAction('match/video/sequences/generatePlayersRounds');
//# sourceMappingURL=sequences-actions.js.map