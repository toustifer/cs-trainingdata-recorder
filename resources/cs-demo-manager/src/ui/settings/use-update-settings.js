import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { settingsUpdated } from './settings-actions';
export function useUpdateSettings() {
    const dispatch = useDispatch();
    const updateSettings = async (partialSettings, options) => {
        const newSettings = await window.csdm.updateSettings(partialSettings, options);
        dispatch(settingsUpdated({
            settings: newSettings,
        }));
    };
    return updateSettings;
}
//# sourceMappingURL=use-update-settings.js.map