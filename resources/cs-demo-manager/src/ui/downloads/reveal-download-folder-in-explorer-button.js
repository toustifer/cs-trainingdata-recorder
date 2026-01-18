import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Button } from 'csdm/ui/components/buttons/button';
import { useDownloadFolderPath } from 'csdm/ui/settings/downloads/use-download-folder-path';
import { Tooltip } from 'csdm/ui/components/tooltip';
export function RevealDownloadFolderInExplorerButton() {
    const downloadFolder = useDownloadFolderPath();
    const onClick = () => {
        if (downloadFolder !== undefined) {
            window.csdm.browseToFolder(downloadFolder);
        }
    };
    const isDisabled = downloadFolder === undefined;
    const button = (React.createElement(Button, { onClick: onClick, isDisabled: isDisabled },
        React.createElement(Trans, { context: "Button" }, "Reveal download folder")));
    if (!isDisabled) {
        return button;
    }
    return (React.createElement(Tooltip, { content: React.createElement(Trans, { context: "Tooltip" }, "A download folder is required. You can change it from settings.") }, button));
}
//# sourceMappingURL=reveal-download-folder-in-explorer-button.js.map