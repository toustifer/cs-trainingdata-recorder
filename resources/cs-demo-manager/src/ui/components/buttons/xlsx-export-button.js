import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Button } from './button';
export function XlsxExportButton({ onClick }) {
    return (React.createElement(Button, { onClick: onClick },
        React.createElement(Trans, { context: "Button" }, "XLSX export")));
}
//# sourceMappingURL=xlsx-export-button.js.map