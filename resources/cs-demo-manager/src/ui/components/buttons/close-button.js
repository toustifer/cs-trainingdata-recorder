import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Button } from 'csdm/ui/components/buttons/button';
export function CloseButton(props) {
    return (React.createElement(Button, { ...props },
        React.createElement(Trans, { context: "Button" }, "Close")));
}
//# sourceMappingURL=close-button.js.map