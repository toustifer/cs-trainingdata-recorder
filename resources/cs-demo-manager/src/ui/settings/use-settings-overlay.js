import { useContext } from 'react';
import { SettingsOverlayContext } from './settings-overlay-provider';
export function useSettingsOverlay() {
    const settingsOverlay = useContext(SettingsOverlayContext);
    return settingsOverlay;
}
//# sourceMappingURL=use-settings-overlay.js.map