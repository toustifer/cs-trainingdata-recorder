import React, { useId } from 'react';
import { Trans } from '@lingui/react/macro';
import { InputLabel } from 'csdm/ui/components/inputs/input-label';
import { FieldError } from 'csdm/ui/components/form/field-error';
import { useCameraFormField } from './use-camera-form-field';
import { ColorPicker } from 'csdm/ui/components/inputs/color-picker';
export function CameraColorInput() {
    const id = useId();
    const { value, error, setField } = useCameraFormField('color');
    return (React.createElement("div", { className: "flex flex-col gap-y-8" },
        React.createElement(InputLabel, { htmlFor: id },
            React.createElement(Trans, { context: "Input label" }, "Color")),
        React.createElement(ColorPicker, { id: id, value: value, onChange: (event) => {
                setField(event.target.value);
            } }),
        React.createElement(FieldError, { error: error })));
}
//# sourceMappingURL=camera-color-input.js.map