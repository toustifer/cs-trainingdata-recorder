import { createAction } from '@reduxjs/toolkit';
export const fetchDemosStart = createAction('demos/fetchStart');
export const fetchDemosProgress = createAction('demos/fetchProgress');
export const fetchDemosError = createAction('demos/fetchError');
export const fetchDemosSuccess = createAction('demos/fetchSuccess');
export const deleteDemosSuccess = createAction('demos/deleteSuccess');
export const demosSourceUpdated = createAction('demos/sourceUpdated');
export const demosTypeUpdated = createAction('demos/typeUpdated');
export const selectionChanged = createAction('demos/selectionChanged');
export const fuzzySearchTextChanged = createAction('demos/fuzzySearchTextChanged');
export const demoRenamed = createAction('demos/renamed');
export const demosDeleted = createAction('demos/deleted');
//# sourceMappingURL=demos-actions.js.map