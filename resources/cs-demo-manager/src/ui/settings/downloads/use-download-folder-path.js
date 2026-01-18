import { useSettings } from '../use-settings';
export function useDownloadFolderPath() {
    const settings = useSettings();
    return settings.download.folderPath;
}
//# sourceMappingURL=use-download-folder-path.js.map