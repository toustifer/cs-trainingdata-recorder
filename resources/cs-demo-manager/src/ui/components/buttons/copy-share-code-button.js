import React from 'react';
import { Trans } from '@lingui/react/macro';
import { CopyButton } from './copy-button';
export function CopyShareCodeButton({ shareCode }) {
    if (shareCode === '') {
        return null;
    }
    return (React.createElement(CopyButton, { data: shareCode },
        React.createElement(Trans, { context: "Button" }, "Copy share code")));
}
//# sourceMappingURL=copy-share-code-button.js.map