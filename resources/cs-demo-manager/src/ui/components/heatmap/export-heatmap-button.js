import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { Button, ButtonVariant } from 'csdm/ui/components/buttons/button';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { useShowToast } from '../toasts/use-show-toast';
function cropCanvasTransparentAreas(canvas) {
    const context = canvas.getContext('2d');
    const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    const pixels = imageData.data;
    // find the bounds of non-transparent pixels
    let minX = canvas.width;
    let minY = canvas.height;
    let maxX = 0;
    let maxY = 0;
    for (let y = 0; y < canvas.height; y++) {
        for (let x = 0; x < canvas.width; x++) {
            const alpha = pixels[(y * canvas.width + x) * 4 + 3]; // each pixel has 4 values: RGBA and alpha is at index 3
            if (alpha > 0) {
                minX = Math.min(minX, x);
                minY = Math.min(minY, y);
                maxX = Math.max(maxX, x);
                maxY = Math.max(maxY, y);
            }
        }
    }
    const croppedWidth = maxX - minX + 1;
    const croppedHeight = maxY - minY + 1;
    const croppedCanvas = document.createElement('canvas');
    croppedCanvas.width = croppedWidth;
    croppedCanvas.height = croppedHeight;
    const croppedContext = croppedCanvas.getContext('2d');
    croppedContext.drawImage(canvas, minX, minY, croppedWidth, croppedHeight, 0, 0, croppedWidth, croppedHeight);
    return croppedCanvas;
}
function buildImageBase64() {
    const radarCanvas = document.getElementById('radar-canvas');
    if (radarCanvas === null) {
        throw new Error('Radar canvas is not initialized');
    }
    const heatmapCanvas = document.getElementById('heatmap-canvas');
    if (heatmapCanvas === null) {
        throw new Error('Heatmap canvas is not initialized');
    }
    const canvas = document.createElement('canvas');
    canvas.width = radarCanvas.width;
    canvas.height = radarCanvas.height;
    const context = canvas.getContext('2d');
    context.drawImage(radarCanvas, 0, 0);
    context.drawImage(heatmapCanvas, 0, 0);
    const croppedCanvas = cropCanvasTransparentAreas(canvas);
    return croppedCanvas.toDataURL('image/png').replace(/^data:image\/png;base64,/, '');
}
export function ExportHeatmapButton() {
    const client = useWebSocketClient();
    const { t } = useLingui();
    const showToast = useShowToast();
    const onClick = async () => {
        const options = {
            defaultPath: `heatmap-${Date.now()}.png`,
            title: t({
                id: 'os.dialogTitle.exportAsPNG',
                message: 'Export as PNG',
            }),
            filters: [{ name: 'PNG', extensions: ['png'] }],
        };
        const { canceled, filePath } = await window.csdm.showSaveDialog(options);
        if (!canceled && filePath) {
            const base64 = buildImageBase64();
            const payload = {
                filePath,
                data: base64,
            };
            client.send({
                name: RendererClientMessageName.WriteBase64File,
                payload,
            });
            showToast({
                id: 'heatmap-exported',
                content: React.createElement(Trans, { context: "Toast" }, "Heatmap exported, click here to reveal the file"),
                type: 'success',
                onClick: () => {
                    window.csdm.browseToFile(filePath);
                },
            });
        }
    };
    return (React.createElement("div", null,
        React.createElement(Button, { onClick: onClick, variant: ButtonVariant.Primary },
            React.createElement(Trans, { context: "Button" }, "Export"))));
}
//# sourceMappingURL=export-heatmap-button.js.map