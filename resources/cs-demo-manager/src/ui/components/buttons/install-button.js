import React from 'react';
import { Trans } from '@lingui/react/macro';
import { SpinnableButton } from './spinnable-button';
export function InstallButton({ onClick, isDisabled, isInstalling }) {
    return (React.createElement(SpinnableButton, { onClick: onClick, isDisabled: isDisabled, isLoading: isInstalling },
        React.createElement(Trans, { context: "Button" }, "Install")));
}
//# sourceMappingURL=install-button.js.map