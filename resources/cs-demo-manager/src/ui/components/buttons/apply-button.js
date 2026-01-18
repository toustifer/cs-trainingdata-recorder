import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Button, ButtonVariant } from 'csdm/ui/components/buttons/button';
export function ApplyButton({ onClick, isDisabled }) {
    return (React.createElement(Button, { onClick: onClick, isDisabled: isDisabled, variant: ButtonVariant.Primary },
        React.createElement(Trans, { context: "Button" }, "Apply")));
}
//# sourceMappingURL=apply-button.js.map