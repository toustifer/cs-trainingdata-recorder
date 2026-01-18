import React from 'react';
import { Select, Trans } from '@lingui/react/macro';
import { Button } from 'csdm/ui/components/buttons/button';
import { useShowToast } from '../toasts/use-show-toast';
export function RevealFileInExplorerButton({ path, isDisabled, onFileRevealed, onFileNotFound, variant }) {
    const showToast = useShowToast();
    const onClick = async () => {
        const fileExists = await window.csdm.pathExists(path);
        if (fileExists) {
            window.csdm.browseToFile(path);
            onFileRevealed?.();
        }
        else {
            if (typeof onFileNotFound === 'function') {
                onFileNotFound();
            }
            else {
                showToast({
                    content: React.createElement(Trans, null, "File not found"),
                    type: 'error',
                });
            }
        }
    };
    return (React.createElement(Button, { onClick: onClick, isDisabled: isDisabled, variant: variant },
        React.createElement(Select, { value: window.csdm.platform, _darwin: "Reveal in Finder", _win32: "Reveal in Explorer", other: "Reveal in files explorer" })));
}
//# sourceMappingURL=reveal-file-in-explorer-button.js.map