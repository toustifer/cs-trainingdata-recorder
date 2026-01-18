import { ipcRenderer } from 'electron';
import { toPng } from 'html-to-image';
import { IPCChannel } from 'csdm/common/ipc-channel';
import { writeBase64File } from 'csdm/node/filesystem/write-base64-file';
import { getCssVariableValue } from 'csdm/ui/shared/get-css-variable-value';
// Generates and write on disk a PNG image from an HTML element.
// We don't use the Electron API window.capturePage()/desktopCapturer to generate the image because they capture only
// visible part of the page.
export async function elementToImage({ element, fileName, title }) {
    const options = {
        defaultPath: `${fileName}.png`,
        title,
        filters: [{ name: 'PNG', extensions: ['png'] }],
    };
    const destination = await ipcRenderer.invoke(IPCChannel.ShowSaveDialog, options);
    if (destination.canceled || destination.filePath === undefined) {
        return;
    }
    const backgroundColor = getCssVariableValue('--gray-50');
    const data = await toPng(element, {
        width: element.clientWidth + 20,
        height: element.clientHeight + 20,
        backgroundColor,
        style: {
            margin: '10px',
        },
    });
    const base64 = data.replace(/^data:image\/png;base64,/, '');
    await writeBase64File(destination.filePath, base64);
    return destination.filePath;
}
//# sourceMappingURL=element-to-image.js.map