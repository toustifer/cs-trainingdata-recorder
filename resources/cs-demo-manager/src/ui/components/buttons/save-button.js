import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Button, ButtonVariant } from 'csdm/ui/components/buttons/button';
export function SaveButton({ onClick, isDisabled = false }) {
    return (React.createElement(Button, { onClick: onClick, isDisabled: isDisabled, variant: ButtonVariant.Primary },
        React.createElement(Trans, { context: "Button" }, "Save")));
}
//# sourceMappingURL=save-button.js.map