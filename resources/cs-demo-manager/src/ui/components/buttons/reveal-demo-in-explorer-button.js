import React from 'react';
import { RevealFileInExplorerButton } from 'csdm/ui/components/buttons/reveal-file-in-explorer-button';
import { DemoNotFoundDialog } from 'csdm/ui/components/dialogs/demo-not-found-dialog';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
export function RevealDemoInExplorerButton({ demoPath, isDisabled }) {
    const { showDialog } = useDialog();
    const onFileNotFound = () => {
        showDialog(React.createElement(DemoNotFoundDialog, { demoPath: demoPath }));
    };
    return React.createElement(RevealFileInExplorerButton, { isDisabled: isDisabled, path: demoPath, onFileNotFound: onFileNotFound });
}
//# sourceMappingURL=reveal-demo-in-explorer-button.js.map