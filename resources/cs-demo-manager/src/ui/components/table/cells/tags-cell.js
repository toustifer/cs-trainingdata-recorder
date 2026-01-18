import React from 'react';
import { useTags } from 'csdm/ui/tags/use-tags';
import { TagIndicator } from 'csdm/ui/components/tags/tag-indicator';
export function TagsCell({ data }) {
    const maxVisibleTagCount = 4;
    const yOffset = 5;
    const allTags = useTags();
    const tags = allTags
        .filter((tag) => {
        return data.tagIds.includes(tag.id);
    })
        .slice(0, maxVisibleTagCount);
    return (React.createElement("div", { className: "relative h-32" }, tags.map((tag, index) => {
        const top = index === 0 ? yOffset : index * yOffset + yOffset;
        return React.createElement(TagIndicator, { key: tag.id, tag: tag, top: top });
    })));
}
//# sourceMappingURL=tags-cell.js.map