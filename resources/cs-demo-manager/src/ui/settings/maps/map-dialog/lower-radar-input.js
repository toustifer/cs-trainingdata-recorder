import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { InputLabel } from 'csdm/ui/components/inputs/input-label';
import { ImageDropZone } from 'csdm/ui/components/inputs/image-drop-zone';
import { useMapFormField } from './use-map-form-field';
export function LowerRadarInput() {
    const { value, setField } = useMapFormField('lowerRadarBase64');
    const { t } = useLingui();
    const updateLowerRadarFieldFromImageFilePath = async (imageFilePath) => {
        try {
            const png = await window.csdm.getImageInformation(imageFilePath);
            if (png.width !== png.height) {
                setField(value, t `The radar image must be a square.`);
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
            updateLowerRadarFieldFromImageFilePath(window.csdm.getWebFilePath(files[0]));
        }
    };
    const selectRadarImageFile = async () => {
        const options = {
            properties: ['openFile'],
            filters: [{ extensions: ['png'], name: t `PNG Files` }],
        };
        const { canceled, filePaths } = await window.csdm.showOpenDialog(options);
        if (canceled || filePaths.length === 0) {
            return;
        }
        const [imagePath] = filePaths;
        updateLowerRadarFieldFromImageFilePath(imagePath);
    };
    return (React.createElement("div", { className: "flex flex-col gap-y-8" },
        React.createElement(InputLabel, null,
            React.createElement(Trans, { context: "Input label" }, "Lower radar")),
        React.createElement(ImageDropZone, { onDrop: onDrop, onClick: selectRadarImageFile, src: value })));
}
//# sourceMappingURL=lower-radar-input.js.map