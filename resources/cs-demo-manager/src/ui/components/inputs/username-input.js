import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { TextInput } from 'csdm/ui/components/inputs/text-input';
export function UsernameInput({ username, onChange, isDisabled = true }) {
    const { t } = useLingui();
    return (React.createElement(TextInput, { label: React.createElement(Trans, { context: "Input label" }, "Username"), value: username, placeholder: t({
            context: 'Input placeholder',
            message: 'Username',
        }), onChange: onChange, isDisabled: isDisabled }));
}
//# sourceMappingURL=username-input.js.map