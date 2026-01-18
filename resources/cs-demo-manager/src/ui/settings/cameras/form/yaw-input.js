import React, { useId } from 'react';
import { Trans } from '@lingui/react/macro';
import { InputLabel } from 'csdm/ui/components/inputs/input-label';
import { FieldError } from 'csdm/ui/components/form/field-error';
import { useCameraFormField } from './use-camera-form-field';
import { CameraCoordinatesInputNumber } from './camera-coordinates-input-number';
export function YawInput() {
    const id = useId();
    const { value, error, setField } = useCameraFormField('yaw');
    return (React.createElement("div", { className: "flex flex-col gap-y-8" },
        React.createElement(InputLabel, { htmlFor: id },
            React.createElement(Trans, { context: "Input label" }, "Yaw")),
        React.createElement(CameraCoordinatesInputNumber, { id: id, name: "yaw", value: value, onChange: setField }),
        React.createElement(FieldError, { error: error })));
}
//# sourceMappingURL=yaw-input.js.map