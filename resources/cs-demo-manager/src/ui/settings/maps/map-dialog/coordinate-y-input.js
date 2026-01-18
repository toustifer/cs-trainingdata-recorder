import React, { useId } from 'react';
import { Trans } from '@lingui/react/macro';
import { InputLabel } from 'csdm/ui/components/inputs/input-label';
import { InputNumber } from 'csdm/ui/components/inputs/number-input';
import { FieldError } from 'csdm/ui/components/form/field-error';
import { useMapFormField } from './use-map-form-field';
export function CoordinateYInput() {
    const id = useId();
    const { value, error, setField, validate } = useMapFormField('posY');
    return (React.createElement("div", { className: "flex flex-col gap-y-8" },
        React.createElement(InputLabel, { htmlFor: id },
            React.createElement(Trans, { context: "Input label" }, "Coordinate Y")),
        React.createElement(InputNumber, { id: id, name: "posY", placeholder: "0", allowNegativeNumber: true, value: value, onChange: (event) => {
                setField(event.target.value);
            }, onBlur: validate }),
        React.createElement(FieldError, { error: error })));
}
//# sourceMappingURL=coordinate-y-input.js.map