import React from 'react';
import { Trans } from '@lingui/react/macro';
import { CenteredContent } from 'csdm/ui/components/content';
import { Button, ButtonVariant } from 'csdm/ui/components/buttons/button';
import { useShowDownloadFolderDialog } from 'csdm/ui/settings/downloads/use-show-download-folder-dialog';
export function DownloadsFolderRequired() {
    const showDownloadFolderDialog = useShowDownloadFolderDialog();
    return (React.createElement(CenteredContent, null,
        React.createElement("p", { className: "mb-12 text-subtitle" },
            React.createElement(Trans, null, "A downloads folder is required.")),
        React.createElement(Button, { onClick: showDownloadFolderDialog, variant: ButtonVariant.Primary },
            React.createElement(Trans, { context: "Button" }, "Select downloads folder"))));
}
//# sourceMappingURL=downloads-folder-required.js.map