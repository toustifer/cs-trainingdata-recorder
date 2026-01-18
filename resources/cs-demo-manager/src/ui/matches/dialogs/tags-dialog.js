import React from 'react';
import { ChecksumsTagsDialog } from 'csdm/ui/dialogs/checksums-tags-dialog';
export function MatchesTagsDialog({ matches }) {
    const checksums = [];
    const tagIds = [];
    for (const match of matches) {
        checksums.push(match.checksum);
        tagIds.push(...match.tagIds);
    }
    return React.createElement(ChecksumsTagsDialog, { checksums: checksums, defaultTagIds: tagIds });
}
//# sourceMappingURL=tags-dialog.js.map