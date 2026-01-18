import React from 'react';
import { Trans } from '@lingui/react/macro';
import { SpinnableButton } from 'csdm/ui/components/buttons/spinnable-button';
export function ConnectDatabaseButton({ isLoading, onClick }) {
    return (React.createElement(SpinnableButton, { onClick: onClick, isLoading: isLoading },
        React.createElement(Trans, { context: "Button" }, "Connect")));
}
//# sourceMappingURL=connect-database-button.js.map