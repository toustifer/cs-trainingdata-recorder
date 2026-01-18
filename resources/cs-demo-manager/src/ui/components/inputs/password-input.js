import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { TextInput } from 'csdm/ui/components/inputs/text-input';
export function PasswordInput({ password, onChange, isDisabled = true }) {
    const { t } = useLingui();
    return (React.createElement(TextInput, { label: React.createElement(Trans, { context: "Input label" }, "Password"), value: password, placeholder: t({
            context: 'Input placeholder',
            message: 'Password',
        }), onChange: onChange, isDisabled: isDisabled, type: "password" }));
}
//# sourceMappingURL=password-input.js.map