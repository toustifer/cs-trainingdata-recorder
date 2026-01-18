import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { TextInput } from 'csdm/ui/components/inputs/text-input';
export function DatabaseNameInput({ databaseName, onChange, isDisabled = true }) {
    const { t } = useLingui();
    return (React.createElement(TextInput, { label: React.createElement(Trans, { context: "Input label" }, "Name"), value: databaseName, placeholder: t({
            context: 'Input placeholder',
            message: 'Name',
        }), onChange: onChange, isDisabled: isDisabled }));
}
//# sourceMappingURL=database-name-input.js.map