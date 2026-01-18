import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Button } from 'csdm/ui/components/buttons/button';
export function CancelButton({ onClick, isDisabled }) {
    return (React.createElement(Button, { onClick: onClick, isDisabled: isDisabled },
        React.createElement(Trans, { context: "Button" }, "Cancel")));
}
//# sourceMappingURL=cancel-button.js.map