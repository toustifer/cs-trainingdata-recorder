import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Tags } from 'csdm/ui/components/tags/tags';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { ChecksumsTagsDialog } from 'csdm/ui/dialogs/checksums-tags-dialog';
export function DemoTags({ checksum, tagIds }) {
    const { showDialog } = useDialog();
    const onEditClick = () => {
        showDialog(React.createElement(ChecksumsTagsDialog, { checksums: [checksum], defaultTagIds: tagIds }));
    };
    return (React.createElement("div", { className: "flex flex-col gap-y-8" },
        React.createElement("p", null,
            React.createElement(Trans, null, "Tags:")),
        React.createElement(Tags, { tagIds: tagIds, onEditClick: onEditClick })));
}
//# sourceMappingURL=demo-tags.js.map