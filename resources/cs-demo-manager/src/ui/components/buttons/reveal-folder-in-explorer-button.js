import React from 'react';
import { Select, Trans } from '@lingui/react/macro';
import { Button } from 'csdm/ui/components/buttons/button';
import { usePathExists } from 'csdm/ui/hooks/use-path-exists';
import { useShowToast } from '../toasts/use-show-toast';
export function RevealFolderInExplorerButton({ path, isDisabled, variant, onFolderRevealed }) {
    const showToast = useShowToast();
    const folderExists = usePathExists(path);
    const onClick = () => {
        if (folderExists) {
            window.csdm.browseToFolder(path);
            onFolderRevealed?.();
        }
        else {
            showToast({
                content: React.createElement(Trans, null, "Folder not found"),
                id: 'folder-not-found',
                type: 'error',
            });
        }
    };
    return (React.createElement(Button, { onClick: onClick, isDisabled: isDisabled, variant: variant },
        React.createElement(Select, { value: window.csdm.platform, _darwin: "Reveal in Finder", _win32: "Reveal in Explorer", other: "Reveal in files explorer" })));
}
//# sourceMappingURL=reveal-folder-in-explorer-button.js.map