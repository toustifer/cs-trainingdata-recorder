import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Button } from './button';
export function CopyButton({ data, children, isDisabled }) {
    return (React.createElement(Button, { isDisabled: isDisabled, onClick: () => {
            navigator.clipboard.writeText(data);
        } }, children ? children : React.createElement(Trans, { context: "Button" }, "Copy")));
}
//# sourceMappingURL=copy-button.js.map