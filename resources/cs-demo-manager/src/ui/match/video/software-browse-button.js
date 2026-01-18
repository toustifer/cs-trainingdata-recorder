import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Button } from 'csdm/ui/components/buttons/button';
export function SoftwareBrowseButton({ isDisabled, getApplicationFolderPath }) {
    return (React.createElement(Button, { onClick: async () => {
            const applicationPath = await getApplicationFolderPath();
            window.csdm.browseToFile(applicationPath);
        }, isDisabled: isDisabled },
        React.createElement(Trans, { context: "Button" }, "Browse")));
}
//# sourceMappingURL=software-browse-button.js.map