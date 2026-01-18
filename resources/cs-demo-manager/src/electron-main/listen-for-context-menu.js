import { clipboard, Menu } from 'electron';
import {} from 'electron';
import { i18n } from '@lingui/core';
export function listenForContextMenu(mainWindow) {
    const onContextMenu = (event, { editFlags, isEditable, linkText, linkURL }) => {
        const items = [];
        if (linkURL.length > 0) {
            items.push({
                id: 'copyLink',
                label: i18n.t({
                    id: 'contextMenu.copyLink',
                    message: 'Copy link',
                }),
                click: () => {
                    clipboard.write({
                        bookmark: linkText,
                        text: linkURL,
                    });
                },
            });
        }
        if (editFlags.canCut) {
            items.push({
                label: i18n.t({
                    id: 'contextMenu.cut',
                    message: 'Cut',
                }),
                role: 'cut',
                accelerator: 'CommandOrControl+X',
            });
        }
        if (editFlags.canCopy) {
            items.push({
                label: i18n.t({
                    id: 'contextMenu.copy',
                    message: 'Copy',
                }),
                role: 'copy',
                accelerator: 'CommandOrControl+C',
            });
        }
        if (isEditable && editFlags.canPaste) {
            items.push({
                label: i18n.t({
                    id: 'contextMenu.paste',
                    message: 'Paste',
                }),
                role: 'paste',
                accelerator: 'CommandOrControl+V',
            });
        }
        if (editFlags.canDelete) {
            items.push({
                type: 'separator',
            }, {
                label: i18n.t({
                    id: 'contextMenu.delete',
                    message: 'Delete',
                }),
                role: 'delete',
            });
        }
        if (items.length > 0) {
            const menu = Menu.buildFromTemplate(items);
            menu.popup({
                window: mainWindow,
            });
        }
    };
    mainWindow.webContents.removeAllListeners('context-menu');
    mainWindow.webContents.addListener('context-menu', onContextMenu);
}
//# sourceMappingURL=listen-for-context-menu.js.map