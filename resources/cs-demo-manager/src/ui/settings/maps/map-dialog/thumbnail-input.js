import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { InputLabel } from 'csdm/ui/components/inputs/input-label';
import { ImageDropZone } from 'csdm/ui/components/inputs/image-drop-zone';
import { useMapFormField } from './use-map-form-field';
export function ThumbnailInput() {
    const { value, setField } = useMapFormField('thumbnailBase64');
    const { t } = useLingui();
    const updateFieldFromImageFilePath = async (imageFilePath) => {
        try {
            const maxFileWidth = 600;
            const maxFileHeight = 340;
            const png = await window.csdm.getImageInformation(imageFilePath);
            if (png.width > maxFileWidth || png.height > maxFileHeight) {
                setField(value, t `Thumbnail image pixels must be smaller than ${maxFileWidth}x${maxFileHeight}`);
                return;
            }
            setField(png.base64, undefined);
        }
        catch (error) {
            setField(value, t `Invalid PNG file.`);
        }
    };
    const onDrop = (event) => {
        event.preventDefault();
        const { files } = event.dataTransfer;
        if (files.length > 0) {
            updateFieldFromImageFilePath(window.csdm.getWebFilePath(files[0]));
        }
    };
    const selectThumbnailFile = async () => {
        const options = {
            properties: ['openFile'],
            filters: [{ extensions: ['png'], name: t `PNG Files` }],
        };
        const { canceled, filePaths } = await window.csdm.showOpenDialog(options);
        if (canceled || filePaths.length === 0) {
            return;
        }
        const [imagePath] = filePaths;
        updateFieldFromImageFilePath(imagePath);
    };
    return (React.createElement("div", { className: "flex flex-col gap-y-8" },
        React.createElement(InputLabel, null,
            React.createElement(Trans, { context: "Input label" }, "Thumbnail")),
        React.createElement(ImageDropZone, { onDrop: onDrop, onClick: selectThumbnailFile, src: value })));
}
//# sourceMappingURL=thumbnail-input.js.map