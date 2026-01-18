import { updateSettings } from 'csdm/node/settings/update-settings';
import { RendererServerMessageName } from 'csdm/server/renderer-server-message-name';
import { server } from 'csdm/server/server';
export async function updateSettingsAndNotifyRendererProcess(partialSettings, options) {
    const newSettings = await updateSettings(partialSettings, options);
    server.sendMessageToRendererProcess({
        name: RendererServerMessageName.SettingsUpdated,
        payload: newSettings,
    });
}
//# sourceMappingURL=update-settings-and-notify-renderer-process.js.map