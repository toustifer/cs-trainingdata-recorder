import React, {} from 'react';
import { useTags } from 'csdm/ui/tags/use-tags';
import { Trans } from '@lingui/react/macro';
import { FilterCategory } from 'csdm/ui/components/dropdown-filter/filter-category';
import { FilterValue } from 'csdm/ui/components/dropdown-filter/filter-value';
import { FilterSelection } from 'csdm/ui/components/dropdown-filter/filter-selection';
function ColorIndicator({ color }) {
    return (React.createElement("div", { className: "size-12 rounded-full border border-gray-300", style: {
            backgroundColor: color,
        } }));
}
export function TagsFilter({ selectedTagIds, onChange, hasActiveFilter, title }) {
    const tags = useTags();
    const onSelectAllClick = () => {
        const tagIds = tags.map((tag) => tag.id);
        onChange(tagIds);
    };
    const onDeselectAllClick = () => {
        onChange([]);
    };
    return (React.createElement(FilterCategory, { name: title ?? React.createElement(Trans, { context: "Tags filter label" }, "Tags"), right: React.createElement(FilterSelection, { onSelectAllClick: onSelectAllClick, onDeselectAllClick: onDeselectAllClick, hasActiveFilter: hasActiveFilter }) }, tags.map((tag) => {
        const isSelected = selectedTagIds.includes(tag.id);
        const onClick = () => {
            const newSelectedTagIds = isSelected
                ? selectedTagIds.filter((id) => id !== tag.id)
                : [...selectedTagIds, tag.id];
            onChange(newSelectedTagIds);
        };
        return (React.createElement(FilterValue, { key: tag.id, isSelected: isSelected, onClick: onClick },
            React.createElement("div", { className: "flex items-center gap-x-8" },
                React.createElement(ColorIndicator, { color: tag.color }),
                React.createElement("span", null, tag.name))));
    })));
}
//# sourceMappingURL=tags-filter.js.map