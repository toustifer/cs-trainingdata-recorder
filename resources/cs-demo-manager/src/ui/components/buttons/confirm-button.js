import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Button, ButtonVariant } from 'csdm/ui/components/buttons/button';
export function ConfirmButton(props) {
    return (React.createElement(Button, { variant: ButtonVariant.Primary, ...props },
        React.createElement(Trans, { context: "Button" }, "Confirm")));
}
//# sourceMappingURL=confirm-button.js.map