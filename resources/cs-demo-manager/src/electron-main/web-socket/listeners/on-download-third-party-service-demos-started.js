import { Notification } from 'electron';
import { windowManager } from 'csdm/electron-main/window-manager';
import { ArgumentName } from 'csdm/common/argument/argument-name';
import { StartPath } from 'csdm/common/argument/start-path';
import { IPCChannel } from 'csdm/common/ipc-channel';
export function onDownloadThirdPartyServiceDemosStarted(params) {
    const mainWindow = windowManager.getMainWindow();
    if (mainWindow && !mainWindow.isDestroyed() && mainWindow.isFocused()) {
        return;
    }
    const notification = new Notification({
        title: params.title,
        body: params.message,
    });
    notification.on('click', () => {
        const mainWindow = windowManager.getOrCreateMainWindow();
        windowManager.setStartupArgument(ArgumentName.StartPath, StartPath.Downloads);
        mainWindow.webContents.send(IPCChannel.NavigateToPendingDownloads);
        mainWindow.show();
        mainWindow.focus();
    });
    notification.show();
}
//# sourceMappingURL=on-download-third-party-service-demos-started.js.map