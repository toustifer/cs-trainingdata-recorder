import React, { useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { TextInput } from 'csdm/ui/components/inputs/text-input';
import { isEmptyString } from 'csdm/common/string/is-empty-string';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { demoRenamed } from 'csdm/ui/demos/demos-actions';
import { useShowToast } from 'csdm/ui/components/toasts/use-show-toast';
export function DemoNameInput({ checksum, currentName }) {
    const client = useWebSocketClient();
    const dispatch = useDispatch();
    const showToast = useShowToast();
    const [name, setName] = useState(currentName);
    const onBlur = async () => {
        const isNameValid = name !== currentName && !isEmptyString(name);
        if (!isNameValid) {
            return;
        }
        try {
            const payload = {
                checksum,
                name,
            };
            await client.send({
                name: RendererClientMessageName.RenameDemo,
                payload,
            });
            dispatch(demoRenamed({ checksum, name }));
        }
        catch (error) {
            showToast({
                content: React.createElement(Trans, null, "An error occurred"),
                id: 'rename-demo-error',
                type: 'error',
            });
        }
    };
    const onChange = (event) => {
        setName(event.target.value);
    };
    return React.createElement(TextInput, { label: React.createElement(Trans, null, "Name:"), value: name, onChange: onChange, onBlur: onBlur });
}
//# sourceMappingURL=demo-name-input.js.map