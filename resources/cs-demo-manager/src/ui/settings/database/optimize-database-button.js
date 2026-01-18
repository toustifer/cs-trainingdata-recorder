import React, { useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { ConfirmDialog } from 'csdm/ui/dialogs/confirm-dialog';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { Button, ButtonVariant } from 'csdm/ui/components/buttons/button';
import { Checkbox } from 'csdm/ui/components/inputs/checkbox';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { ExclamationTriangleIcon } from 'csdm/ui/icons/exclamation-triangle-icon';
import { ErrorMessage } from 'csdm/ui/components/error-message';
function OptimizeDatabaseDialog() {
    const client = useWebSocketClient();
    const { hideDialog } = useDialog();
    const [state, setState] = useState({
        error: undefined,
        isBusy: false,
        payload: {
            clearPositions: false,
            clearOrphanDemos: false,
            clearDemos: false,
        },
    });
    const isConfirmButtonDisabled = !Object.values(state.payload).some(Boolean) || state.isBusy;
    const onConfirmClick = async () => {
        try {
            setState({
                ...state,
                isBusy: true,
            });
            await client.send({
                name: RendererClientMessageName.OptimizeDatabase,
                payload: state.payload,
            });
            hideDialog();
        }
        catch (error) {
            setState({
                ...state,
                isBusy: false,
                error: typeof error === 'string' ? error : React.createElement(Trans, null, "An error occurred."),
            });
        }
    };
    return (React.createElement(ConfirmDialog, { title: React.createElement(Trans, null, "Optimize database"), onConfirm: onConfirmClick, closeOnConfirm: false, isBusy: state.isBusy, isConfirmButtonDisabled: isConfirmButtonDisabled, confirmButtonVariant: ButtonVariant.Danger },
        React.createElement(Checkbox, { label: React.createElement(Trans, null, "Delete positions"), isChecked: state.payload.clearPositions, isDisabled: state.isBusy, onChange: (event) => {
                setState({
                    ...state,
                    payload: {
                        ...state.payload,
                        clearPositions: event.target.checked,
                    },
                });
            } }),
        React.createElement("div", { className: "mb-8 flex items-center gap-x-4" },
            React.createElement(ExclamationTriangleIcon, { className: "size-12 text-orange-700" }),
            React.createElement("p", { className: "text-caption" },
                React.createElement(Trans, null, "It will delete all data required for the 2D viewer!"))),
        React.createElement(Checkbox, { label: React.createElement(Trans, null, "Delete demos that are not on the filesystem anymore"), isChecked: state.payload.clearOrphanDemos, isDisabled: state.isBusy, onChange: (event) => {
                setState({
                    ...state,
                    payload: {
                        ...state.payload,
                        clearOrphanDemos: event.target.checked,
                    },
                });
            } }),
        React.createElement(Checkbox, { label: React.createElement(Trans, null, "Clear demos cache"), isChecked: state.payload.clearDemos, isDisabled: state.isBusy, onChange: (event) => {
                setState({
                    ...state,
                    payload: {
                        ...state.payload,
                        clearDemos: event.target.checked,
                    },
                });
            } }),
        state.error !== undefined && (React.createElement("div", { className: "mt-8" },
            React.createElement(ErrorMessage, { message: state.error })))));
}
export function OptimizeDatabaseButton() {
    const { showDialog } = useDialog();
    const onClick = () => {
        showDialog(React.createElement(OptimizeDatabaseDialog, null));
    };
    return (React.createElement(Button, { onClick: onClick },
        React.createElement(Trans, { context: "Button" }, "Optimize database")));
}
//# sourceMappingURL=optimize-database-button.js.map