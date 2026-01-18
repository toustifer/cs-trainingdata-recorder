import { createAction } from '@reduxjs/toolkit';
export const downloadDemoError = createAction('downloads/downloadDemoError');
export const downloadDemoExpired = createAction('downloads/downloadDemoExpired');
export const downloadDemoSuccess = createAction('downloads/downloadDemoSuccess');
export const downloadDemoCorrupted = createAction('downloads/downloadDemoCorrupted');
export const downloadsAdded = createAction('downloads/downloadsAdded');
export const downloadDemoProgressChanged = createAction('downloads/downloadProgress');
export const demoDownloadedInCurrentFolderLoaded = createAction('downloads/demoDownloadedInCurrentFolderLoaded');
//# sourceMappingURL=downloads-actions.js.map