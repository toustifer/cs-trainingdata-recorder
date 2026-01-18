import React from 'react';
import { RenameDialog } from 'csdm/ui/components/dialogs/rename-dialog';
export function RenameMatchDialog({ matches }) {
    if (matches.length === 0) {
        return null;
    }
    const [{ name, checksum }] = matches;
    return React.createElement(RenameDialog, { checksum: checksum, currentName: name });
}
//# sourceMappingURL=rename-match-dialog.js.map