import React from 'react';
import { Trans } from '@lingui/react/macro';
import { TextInput } from 'csdm/ui/components/inputs/text-input';
import { FieldError } from 'csdm/ui/components/form/field-error';
import { useMapFormField } from './use-map-form-field';
export function NameInput({ isDisabled }) {
    const { value, error, setField, validate } = useMapFormField('name');
    return (React.createElement("div", { className: "flex flex-col gap-y-8" },
        React.createElement("div", { className: "w-[224px]" },
            React.createElement(TextInput, { label: React.createElement(Trans, { context: "Input label" }, "Name"), name: "name", placeholder: "de_example", isDisabled: isDisabled, value: value, autoFocus: true, onChange: (event) => {
                    setField(event.target.value);
                }, onBlur: validate })),
        React.createElement(FieldError, { error: error })));
}
//# sourceMappingURL=name-input.js.map