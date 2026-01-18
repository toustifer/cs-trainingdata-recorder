import React, { useId } from 'react';
import { Trans } from '@lingui/react/macro';
import { InputLabel } from 'csdm/ui/components/inputs/input-label';
import { InputNumber } from 'csdm/ui/components/inputs/number-input';
import { FieldError } from 'csdm/ui/components/form/field-error';
import { useMapFormField } from './use-map-form-field';
export function CoordinateXInput() {
    const id = useId();
    const { value, error, setField, validate } = useMapFormField('posX');
    return (React.createElement("div", { className: "flex flex-col gap-y-8" },
        React.createElement(InputLabel, { htmlFor: id },
            React.createElement(Trans, { context: "Input label" }, "Coordinate X")),
        React.createElement(InputNumber, { id: id, name: "posX", placeholder: "0", allowNegativeNumber: true, value: value, onChange: (event) => {
                setField(event.target.value);
            }, onBlur: validate }),
        React.createElement(FieldError, { error: error })));
}
//# sourceMappingURL=coordinate-x-input.js.map