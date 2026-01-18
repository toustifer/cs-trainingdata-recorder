import { useDownloadFolderPath } from './use-download-folder-path';
export function useDownloadFolderPathOrThrowError() {
    const downloadFolderPath = useDownloadFolderPath();
    if (downloadFolderPath === undefined) {
        throw new Error('Download folder not setup');
    }
    return downloadFolderPath;
}
//# sourceMappingURL=use-download-folder-path-or-throw-error.js.map