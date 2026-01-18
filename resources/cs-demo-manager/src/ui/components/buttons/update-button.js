import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Button, ButtonVariant } from 'csdm/ui/components/buttons/button';
export function UpdateButton({ onClick, isDisabled = false, variant = ButtonVariant.Primary, ...props }) {
    return (React.createElement(Button, { onClick: onClick, isDisabled: isDisabled, variant: variant, ...props },
        React.createElement(Trans, { context: "Button" }, "Update")));
}
//# sourceMappingURL=update-button.js.map