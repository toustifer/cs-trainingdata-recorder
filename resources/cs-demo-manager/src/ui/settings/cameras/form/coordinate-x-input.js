import React, { useId } from 'react';
import { Trans } from '@lingui/react/macro';
import { InputLabel } from 'csdm/ui/components/inputs/input-label';
import { FieldError } from 'csdm/ui/components/form/field-error';
import { useCameraFormField } from '../../cameras/form/use-camera-form-field';
import { CameraCoordinatesInputNumber } from './camera-coordinates-input-number';
export function CoordinateXInput() {
    const id = useId();
    const { value, error, setField } = useCameraFormField('x');
    return (React.createElement("div", { className: "flex flex-col gap-y-8" },
        React.createElement(InputLabel, { htmlFor: id },
            React.createElement(Trans, { context: "Input label" }, "Coordinate X")),
        React.createElement(CameraCoordinatesInputNumber, { id: id, name: "x", value: value, onChange: setField }),
        React.createElement(FieldError, { error: error })));
}
//# sourceMappingURL=coordinate-x-input.js.map