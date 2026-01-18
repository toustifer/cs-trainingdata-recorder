import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { InputNumber } from 'csdm/ui/components/inputs/number-input';
export function PortInput({ port, onChange, isDisabled = true }) {
    const { t } = useLingui();
    const maxPortNumber = 65_535;
    return (React.createElement(InputNumber, { label: React.createElement(Trans, { context: "Input label" }, "Port"), defaultValue: String(port), onChange: onChange, placeholder: t({
            context: 'Input placeholder',
            message: 'Port',
        }), isDisabled: isDisabled, max: maxPortNumber }));
}
//# sourceMappingURL=port-input.js.map