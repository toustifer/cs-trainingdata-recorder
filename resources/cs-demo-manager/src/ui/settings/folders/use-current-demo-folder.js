import { useDemosSettings } from './use-demos-settings';
export function useCurrentDemoFolder() {
    const demosSettings = useDemosSettings();
    return demosSettings.currentFolderPath;
}
//# sourceMappingURL=use-current-demo-folder.js.map