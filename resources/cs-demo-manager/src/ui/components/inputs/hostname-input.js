import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { TextInput } from 'csdm/ui/components/inputs/text-input';
export function HostnameInput({ hostname, onChange, isDisabled = true }) {
    const { t } = useLingui();
    return (React.createElement(TextInput, { label: React.createElement(Trans, { context: "Button" }, "Hostname"), value: hostname, placeholder: t({
            context: 'Input placeholder',
            message: 'Hostname',
        }), onChange: onChange, isDisabled: isDisabled }));
}
//# sourceMappingURL=hostname-input.js.map