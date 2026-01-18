import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { InputLabel } from 'csdm/ui/components/inputs/input-label';
import { ImageDropZone } from 'csdm/ui/components/inputs/image-drop-zone';
import { useCameraFormField } from './use-camera-form-field';
import { resizeImage, resizeImageFromFilePath } from 'csdm/ui/shared/resize-image';
export function CameraPreviewInput() {
    const { value, setField } = useCameraFormField('previewBase64');
    const { t } = useLingui();
    const imageWidth = 800;
    const onDrop = async (event) => {
        event.preventDefault();
        const { files } = event.dataTransfer;
        if (files.length > 0) {
            setField(await resizeImage(files[0], imageWidth));
        }
    };
    const showSelector = async () => {
        const options = {
            properties: ['openFile'],
            filters: [{ extensions: ['png', 'jpg', 'jpeg'], name: t `Image Files` }],
        };
        const { canceled, filePaths } = await window.csdm.showOpenDialog(options);
        if (canceled || filePaths.length === 0) {
            return;
        }
        const [imagePath] = filePaths;
        setField(await resizeImageFromFilePath(imagePath, imageWidth));
    };
    return (React.createElement("div", { className: "flex flex-col gap-y-8" },
        React.createElement(InputLabel, null,
            React.createElement(Trans, { context: "Input label" }, "Preview")),
        React.createElement(ImageDropZone, { onDrop: onDrop, onClick: showSelector, width: 400, height: 225, src: value })));
}
//# sourceMappingURL=camera-preview-input.js.map