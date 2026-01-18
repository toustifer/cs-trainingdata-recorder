import React from 'react';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { UpdateDemoLocationDialog } from 'csdm/ui/dialogs/update-demo-location-dialog';
import { RevealFileInExplorerButton } from 'csdm/ui/components/buttons/reveal-file-in-explorer-button';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
export function RevealMatchDemoInExplorerButton() {
    const match = useCurrentMatch();
    const { showDialog } = useDialog();
    const onDemoNotFound = () => {
        showDialog(React.createElement(UpdateDemoLocationDialog, { demoFilePath: match.demoFilePath, checksum: match.checksum }));
    };
    return React.createElement(RevealFileInExplorerButton, { path: match.demoFilePath, onFileNotFound: onDemoNotFound });
}
//# sourceMappingURL=reveal-match-demo-in-explorer-button.js.map