import React, { useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { TextInput } from 'csdm/ui/components/inputs/text-input';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { tagInserted } from 'csdm/ui/tags/tags-actions';
import { Button, ButtonVariant } from 'csdm/ui/components/buttons/button';
import { useGetTagErrorMessageFromError } from './use-get-tag-error-message-from-error';
import { ColorPicker } from 'csdm/ui/components/inputs/color-picker';
import { useShowToast } from 'csdm/ui/components/toasts/use-show-toast';
export function AddTag() {
    const defaultColor = '#000000';
    const [name, setName] = useState('');
    const [color, setColor] = useState(defaultColor);
    const client = useWebSocketClient();
    const dispatch = useDispatch();
    const getErrorMessage = useGetTagErrorMessageFromError();
    const showToast = useShowToast();
    const onNameChange = (event) => {
        setName(event.target.value);
    };
    const onColorChange = (event) => {
        setColor(event.target.value);
    };
    const insertTag = async () => {
        try {
            const payload = {
                name,
                color,
            };
            const tag = await client.send({
                name: RendererClientMessageName.InsertTag,
                payload,
            });
            setName('');
            setColor(defaultColor);
            dispatch(tagInserted({ tag }));
        }
        catch (error) {
            const errorMessage = getErrorMessage(error);
            showToast({
                id: 'add-tag-error',
                content: errorMessage,
                type: 'error',
            });
        }
    };
    return (React.createElement("div", { className: "flex items-center gap-x-8" },
        React.createElement(ColorPicker, { value: color, onChange: onColorChange }),
        React.createElement("div", { className: "w-[224px]" },
            React.createElement(TextInput, { value: name, onChange: onNameChange, onEnterKeyDown: insertTag })),
        React.createElement(Button, { onClick: insertTag, variant: ButtonVariant.Primary, isDisabled: name === '' },
            React.createElement(Trans, { context: "Button" }, "Add"))));
}
//# sourceMappingURL=add-tag.js.map