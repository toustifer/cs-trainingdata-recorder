import React from 'react';
import { ChecksumsTagsDialog } from 'csdm/ui/dialogs/checksums-tags-dialog';
export function DemosTagsDialog({ demos }) {
    const checksums = [];
    const tagIds = [];
    for (const demo of demos) {
        checksums.push(demo.checksum);
        tagIds.push(...demo.tagIds);
    }
    return React.createElement(ChecksumsTagsDialog, { checksums: checksums, defaultTagIds: tagIds });
}
//# sourceMappingURL=tags-dialog.js.map