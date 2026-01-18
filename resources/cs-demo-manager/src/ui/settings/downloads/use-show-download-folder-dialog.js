import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { downloadFolderChanged } from '../settings-actions';
import { useUpdateSettings } from '../use-update-settings';
export function useShowDownloadFolderDialog() {
    const updateSettings = useUpdateSettings();
    const dispatch = useDispatch();
    return async () => {
        const options = { properties: ['openDirectory'] };
        const { filePaths } = await window.csdm.showOpenDialog(options);
        if (filePaths.length > 0) {
            const [folder] = filePaths;
            await updateSettings({
                download: {
                    folderPath: folder,
                },
            });
            dispatch(downloadFolderChanged());
        }
    };
}
//# sourceMappingURL=use-show-download-folder-dialog.js.map