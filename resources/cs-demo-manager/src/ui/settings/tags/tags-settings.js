import React from 'react';
import { SettingsView } from 'csdm/ui/settings/settings-view';
import { useTags } from 'csdm/ui/tags/use-tags';
import { AddTag } from './add-tag';
import { TagEntry } from './tag-entry';
export function TagsSettings() {
    const tags = useTags();
    return (React.createElement(SettingsView, null,
        React.createElement(AddTag, null),
        React.createElement("div", { className: "mt-12 flex flex-col gap-y-8" }, tags.map((tag) => {
            return React.createElement(TagEntry, { key: tag.id, tag: tag });
        }))));
}
//# sourceMappingURL=tags-settings.js.map