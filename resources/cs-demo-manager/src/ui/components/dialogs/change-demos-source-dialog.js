import React, { useState } from 'react';
import { Plural, Trans } from '@lingui/react/macro';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { ConfirmDialog } from 'csdm/ui/dialogs/confirm-dialog';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { Select } from '../inputs/select';
import { Status } from 'csdm/common/types/status';
import { useDemoSources } from 'csdm/ui/demos/use-demo-sources';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { demosSourceUpdated } from 'csdm/ui/demos/demos-actions';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { useShowToast } from '../toasts/use-show-toast';
import { ExclamationTriangleIcon } from 'csdm/ui/icons/exclamation-triangle-icon';
export function ChangeDemosSourceDialog({ checksums, initialSource }) {
    const client = useWebSocketClient();
    const showToast = useShowToast();
    const [source, setSource] = useState(initialSource);
    const [status, setStatus] = useState(Status.Idle);
    const dispatch = useDispatch();
    const demoCount = checksums.length;
    const demoSources = useDemoSources();
    const options = demoSources.map((source) => {
        return {
            value: source.value,
            label: source.name,
        };
    });
    const { hideDialog } = useDialog();
    const onConfirmClick = async () => {
        if (source === undefined) {
            return;
        }
        try {
            const payload = {
                checksums,
                source,
            };
            await client.send({
                name: RendererClientMessageName.UpdateDemosSource,
                payload,
            });
            setStatus(Status.Loading);
            showToast({
                content: React.createElement(Plural, { value: demoCount, one: "# demo updated", other: "# demos updated" }),
                id: 'update-demos',
                type: 'success',
            });
            dispatch(demosSourceUpdated({
                checksums,
                source,
            }));
        }
        catch (error) {
            showToast({
                content: React.createElement(Trans, null, "An error occurred"),
                id: 'update-demos',
                type: 'error',
            });
        }
        finally {
            hideDialog();
        }
    };
    return (React.createElement(ConfirmDialog, { title: React.createElement(Trans, null, "Update source"), onConfirm: onConfirmClick, isBusy: status === Status.Loading, isConfirmButtonDisabled: initialSource !== undefined && initialSource === source },
        React.createElement("div", { className: "flex max-w-[600px] flex-col gap-y-8" },
            React.createElement("div", { className: "flex items-center gap-x-4" },
                React.createElement(ExclamationTriangleIcon, { className: "size-16 shrink-0 text-red-700" }),
                React.createElement("p", null,
                    React.createElement(Trans, null, "Change it only if the source is unknown or incorrect in the app! (for instance Valve instead of FACEIT)"))),
            React.createElement("div", { className: "flex items-center gap-x-4" },
                React.createElement(ExclamationTriangleIcon, { className: "size-16 shrink-0 text-orange-700" }),
                React.createElement("p", { className: "text-caption" },
                    React.createElement(Trans, null, "Changing a demo's source require to re-analyze it to update its match data!"))),
            React.createElement("div", { className: "mx-auto mt-4" },
                React.createElement(Select, { options: options, value: source, onChange: (selectedSource) => {
                        setSource(selectedSource);
                    } })))));
}
//# sourceMappingURL=change-demos-source-dialog.js.map