import React from 'react';
import { useTags } from 'csdm/ui/tags/use-tags';
export function Tag(props) {
    const tags = useTags();
    const tag = tags.find((tag) => tag.id === props.id);
    if (tag === undefined) {
        return null;
    }
    return (React.createElement("div", { className: "flex rounded border border-gray-300 bg-gray-75" },
        React.createElement("div", { className: "w-12 rounded-l border-r border-gray-300", style: {
                backgroundColor: tag.color,
            } }),
        React.createElement("p", { className: "px-8 py-4 text-caption" }, tag.name)));
}
export function TagsTooltip({ tagIds }) {
    return (React.createElement("div", { className: "flex flex-wrap gap-8" }, tagIds.map((tagId) => {
        return React.createElement(Tag, { key: tagId, id: tagId });
    })));
}
//# sourceMappingURL=tag.js.map