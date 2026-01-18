import { useEffect } from 'react';
import { settingsUpdated } from 'csdm/ui/settings/settings-actions';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { RendererServerMessageName } from 'csdm/server/renderer-server-message-name';
export function useRegisterSettingsListeners(client) {
    const dispatch = useDispatch();
    useEffect(() => {
        const onSettingsUpdated = (settings) => {
            dispatch(settingsUpdated({ settings }));
        };
        client.on(RendererServerMessageName.SettingsUpdated, onSettingsUpdated);
        return () => {
            client.off(RendererServerMessageName.SettingsUpdated, onSettingsUpdated);
        };
    });
}
//# sourceMappingURL=use-register-settings-listeners.js.map