import React, { useState } from 'react';
import { TextInput } from 'csdm/ui/components/inputs/text-input';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { tagDeleted, tagUpdated } from 'csdm/ui/tags/tags-actions';
import { useGetTagErrorMessageFromError } from './use-get-tag-error-message-from-error';
import { DeleteButton } from 'csdm/ui/components/buttons/delete-button';
import { ColorPicker } from 'csdm/ui/components/inputs/color-picker';
import { useShowToast } from 'csdm/ui/components/toasts/use-show-toast';
export function TagEntry({ tag }) {
    const [name, setName] = useState(tag.name);
    const [color, setColor] = useState(tag.color);
    const client = useWebSocketClient();
    const dispatch = useDispatch();
    const showToast = useShowToast();
    const getErrorMessage = useGetTagErrorMessageFromError();
    const onChange = (event) => {
        setName(event.target.value);
    };
    const onColorChange = (event) => {
        setColor(event.target.value);
    };
    const updateTag = async () => {
        const hasTagChanged = tag.name !== name || tag.color !== color;
        if (!hasTagChanged) {
            return;
        }
        try {
            const updatedTag = {
                id: tag.id,
                name,
                color,
            };
            await client.send({
                name: RendererClientMessageName.UpdateTag,
                payload: updatedTag,
            });
            dispatch(tagUpdated({ tag: updatedTag }));
        }
        catch (error) {
            const errorMessage = getErrorMessage(error);
            setName(tag.name);
            showToast({
                id: 'edit-tag-error',
                content: errorMessage,
                type: 'error',
            });
        }
    };
    const deleteTag = async () => {
        try {
            await client.send({
                name: RendererClientMessageName.DeleteTag,
                payload: tag.id,
            });
            dispatch(tagDeleted({ tagId: tag.id }));
        }
        catch (error) {
            const errorMessage = getErrorMessage(error);
            showToast({
                id: 'delete-tag-error',
                content: errorMessage,
                type: 'error',
            });
        }
    };
    return (React.createElement("div", { className: "flex items-center gap-x-8" },
        React.createElement(ColorPicker, { value: color, onChange: onColorChange, onBlur: updateTag }),
        React.createElement("div", { className: "w-[224px]" },
            React.createElement(TextInput, { value: name, onChange: onChange, onBlur: updateTag, onEnterKeyDown: updateTag })),
        React.createElement(DeleteButton, { onClick: deleteTag })));
}
//# sourceMappingURL=tag-entry.js.map