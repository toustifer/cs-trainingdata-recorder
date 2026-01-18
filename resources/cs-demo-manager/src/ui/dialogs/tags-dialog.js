import React, { useState } from 'react';
import { Trans } from '@lingui/react/macro';
import clsx from 'clsx';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'csdm/ui/dialogs/dialog';
import { useTags } from 'csdm/ui/tags/use-tags';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { CloseButton } from 'csdm/ui/components/buttons/close-button';
import { SaveButton } from '../components/buttons/save-button';
import { areArraysValuesTheSame } from 'csdm/common/array/are-arrays-values-the-same';
export function TagsDialog({ defaultTagIds, onTagIdsUpdated }) {
    const tags = useTags();
    const { hideDialog } = useDialog();
    const [selectedTags, setSelectedTags] = useState(defaultTagIds);
    const submit = () => {
        const changed = !areArraysValuesTheSame(selectedTags, defaultTagIds);
        if (changed) {
            onTagIdsUpdated(selectedTags);
        }
        hideDialog();
    };
    return (React.createElement(Dialog, { onEnterPressed: submit },
        React.createElement(DialogHeader, null,
            React.createElement(DialogTitle, null,
                React.createElement(Trans, null, "Tags"))),
        React.createElement(DialogContent, null,
            React.createElement("div", { className: "flex max-h-[300px] max-w-[524px] flex-wrap gap-8 overflow-auto" }, tags.map((tag) => {
                const isSelected = selectedTags.some((tagId) => {
                    return tagId === tag.id;
                });
                return (React.createElement("div", { key: tag.id, className: clsx('flex cursor-default rounded border border-gray-300 hover:text-gray-900', isSelected
                        ? 'border-gray-400 bg-gray-50 text-gray-900 hover:bg-gray-100'
                        : 'border-transparent bg-gray-200 text-gray-600'), onClick: () => {
                        const newSelectedTagIds = isSelected
                            ? selectedTags.filter((id) => id !== tag.id)
                            : [...selectedTags, tag.id];
                        setSelectedTags(newSelectedTagIds);
                    } },
                    React.createElement("div", { className: "w-12 rounded-l border-r", style: {
                            backgroundColor: tag.color,
                            opacity: isSelected ? 1 : 0.5,
                        } }),
                    React.createElement("p", { className: "px-8 py-4" }, tag.name)));
            }))),
        React.createElement(DialogFooter, null,
            React.createElement(SaveButton, { onClick: submit }),
            React.createElement(CloseButton, { onClick: hideDialog }))));
}
//# sourceMappingURL=tags-dialog.js.map