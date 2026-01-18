import React from 'react';
import { Trans } from '@lingui/react/macro';
import { CopyButton } from './copy-button';
export function CopyDemoLinkButton({ link }) {
    return (React.createElement(CopyButton, { data: link },
        React.createElement(Trans, { context: "Button" }, "Copy demo link")));
}
//# sourceMappingURL=copy-demo-link-button.js.map