import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Button } from 'csdm/ui/components/buttons/button';
export function RetryButton({ onClick }) {
    return (React.createElement(Button, { onClick: onClick },
        React.createElement(Trans, { context: "Button" }, "Retry")));
}
//# sourceMappingURL=retry-button.js.map