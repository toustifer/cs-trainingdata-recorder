import React from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'csdm/ui/dialogs/dialog';
import { ThumbnailInput } from 'csdm/ui/settings/maps/map-dialog/thumbnail-input';
import { RadarInput } from 'csdm/ui/settings/maps/map-dialog/radar-input';
import { CoordinateXInput } from 'csdm/ui/settings/maps/map-dialog/coordinate-x-input';
import { CoordinateYInput } from 'csdm/ui/settings/maps/map-dialog/coordinate-y-input';
import { ScaleInput } from 'csdm/ui/settings/maps/map-dialog/scale-input';
import { FieldError } from 'csdm/ui/components/form/field-error';
import { LowerRadarInput } from 'csdm/ui/settings/maps/map-dialog/lower-radar-input';
import { CancelButton } from 'csdm/ui/components/buttons/cancel-button';
import { SaveButton } from 'csdm/ui/components/buttons/save-button';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { useMapForm } from 'csdm/ui/settings/maps/map-dialog/use-map-form';
import { Trans } from '@lingui/react/macro';
import { ExternalLink } from 'csdm/ui/components/external-link';
import { ThresholdZInput } from './threshold-z-input';
function InputsRow({ children }) {
    return React.createElement("div", { className: "flex gap-x-12" }, children);
}
export function MapFormDialog({ nameInput, error, onSubmit }) {
    const { fields, validate, id, game } = useMapForm();
    const { hideDialog } = useDialog();
    const validateAndSubmit = () => {
        const isValid = validate();
        if (isValid) {
            const payload = {
                id,
                name: fields.name.value,
                game,
                posX: Number(fields.posX.value),
                posY: Number(fields.posY.value),
                thresholdZ: Number(fields.thresholdZ.value),
                scale: Number(fields.scale.value),
                radarBase64: fields.radarBase64.value,
                lowerRadarBase64: fields.lowerRadarBase64.value,
                thumbnailBase64: fields.thumbnailBase64.value,
            };
            onSubmit(payload);
        }
    };
    return (React.createElement(Dialog, { onEnterPressed: (event) => {
            event.preventDefault();
            validateAndSubmit();
        } },
        React.createElement(DialogHeader, null,
            React.createElement(DialogTitle, null,
                React.createElement(Trans, { context: "Dialog title" }, "Map"))),
        React.createElement(DialogContent, null,
            React.createElement("div", { className: "flex flex-col gap-y-8" },
                nameInput,
                React.createElement(InputsRow, null,
                    React.createElement(CoordinateXInput, null),
                    React.createElement(CoordinateYInput, null),
                    React.createElement(ThresholdZInput, null),
                    React.createElement(ScaleInput, null)),
                React.createElement(InputsRow, null,
                    React.createElement(ThumbnailInput, null),
                    React.createElement(RadarInput, null),
                    React.createElement(LowerRadarInput, null)),
                React.createElement(FieldError, { error: error || fields.thumbnailBase64.error || fields.radarBase64.error || fields.lowerRadarBase64.error }))),
        React.createElement(DialogFooter, null,
            React.createElement("div", { className: "mr-auto" },
                React.createElement(ExternalLink, { href: "https://cs-demo-manager.com/docs/guides/maps#addingediting-a-map" },
                    React.createElement(Trans, null, "Documentation"))),
            React.createElement(SaveButton, { onClick: validateAndSubmit }),
            React.createElement(CancelButton, { onClick: hideDialog }))));
}
//# sourceMappingURL=map-form-dialog.js.map