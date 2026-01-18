import React from 'react';
import { RenameDialog } from 'csdm/ui/components/dialogs/rename-dialog';
export function RenameDemoDialog({ demos }) {
    if (demos.length === 0) {
        return null;
    }
    const [{ name, checksum }] = demos;
    return React.createElement(RenameDialog, { checksum: checksum, currentName: name });
}
//# sourceMappingURL=rename-demo-dialog.js.map