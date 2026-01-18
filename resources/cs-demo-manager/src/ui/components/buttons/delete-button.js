import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Button, ButtonVariant } from './button';
export function DeleteButton({ onClick }) {
    return (React.createElement(Button, { onClick: onClick, variant: ButtonVariant.Danger },
        React.createElement(Trans, { context: "Button" }, "Delete")));
}
//# sourceMappingURL=delete-button.js.map