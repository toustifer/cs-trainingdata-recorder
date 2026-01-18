import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Button } from 'csdm/ui/components/buttons/button';
export function RefreshButton({ isDisabled, onClick }) {
    return (React.createElement(Button, { onClick: onClick, isDisabled: isDisabled },
        React.createElement(Trans, { context: "Button" }, "Refresh")));
}
//# sourceMappingURL=refresh-button.js.map