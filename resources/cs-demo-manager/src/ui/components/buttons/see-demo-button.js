import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Button } from './button';
export function SeeDemoButton({ onClick, isDisabled }) {
    return (React.createElement(Button, { onClick: onClick, isDisabled: isDisabled },
        React.createElement(Trans, { context: "Button" }, "See demo")));
}
//# sourceMappingURL=see-demo-button.js.map