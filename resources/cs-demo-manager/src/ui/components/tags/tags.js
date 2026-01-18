import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Tooltip } from 'csdm/ui/components/tooltip';
import { Button } from 'csdm/ui/components/buttons/button';
import { TagIcon } from 'csdm/ui/icons/tag-icon';
import { Tag, TagsTooltip } from 'csdm/ui/components/tags/tag';
export function Tags({ onEditClick, tagIds }) {
    const visibleTagIds = tagIds.slice(0, 3);
    const hiddenTagIds = tagIds.slice(3);
    return (React.createElement("div", { className: "flex flex-wrap items-center gap-x-8 gap-y-4" },
        onEditClick && (React.createElement(Tooltip, { content: React.createElement(Trans, null, "Edit tags") },
            React.createElement(Button, { onClick: onEditClick },
                React.createElement(TagIcon, { height: 14 })))),
        visibleTagIds.length === 0 ? (React.createElement("p", null,
            React.createElement(Trans, null, "No tags"))) : (visibleTagIds.map((tagId) => {
            return React.createElement(Tag, { key: tagId, id: tagId });
        })),
        hiddenTagIds.length > 0 && (React.createElement(Tooltip, { content: React.createElement(TagsTooltip, { tagIds: hiddenTagIds }) },
            React.createElement("div", { className: "flex items-center justify-center rounded border border-transparent bg-gray-75 px-8 py-4" },
                React.createElement("p", { className: "text-caption" },
                    "+",
                    hiddenTagIds.length))))));
}
//# sourceMappingURL=tags.js.map