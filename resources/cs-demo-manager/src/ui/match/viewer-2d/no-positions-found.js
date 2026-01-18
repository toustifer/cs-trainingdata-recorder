import React, { useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { Button, ButtonVariant } from 'csdm/ui/components/buttons/button';
import { CenteredContent } from 'csdm/ui/components/content';
import { Status } from 'csdm/common/types/status';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'csdm/ui/dialogs/dialog';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { Spinner } from 'csdm/ui/components/spinner';
import { ExclamationTriangleIcon } from 'csdm/ui/icons/exclamation-triangle-icon';
import { RendererServerMessageName } from 'csdm/server/renderer-server-message-name';
import { useCurrentMatch } from '../use-current-match';
import { ErrorCode } from 'csdm/common/error-code';
import { CancelButton } from 'csdm/ui/components/buttons/cancel-button';
function GeneratingDialog({ onPositionsAvailable }) {
    const client = useWebSocketClient();
    const { hideDialog } = useDialog();
    const match = useCurrentMatch();
    const [status, setStatus] = useState(Status.Idle);
    const [message, setMessage] = useState(React.createElement(Trans, null, "It will analyze the demo and generate positions required for the 2D viewer."));
    const [error, setError] = useState(React.createElement(Trans, null, "An error occurred."));
    const onGenerateClick = async () => {
        const onInsertingPositions = () => {
            setMessage(React.createElement(Trans, null, "Inserting positions into the database\u2026"));
        };
        try {
            setMessage(React.createElement(Trans, null, "Analyzing demo\u2026"));
            setStatus(Status.Loading);
            client.on(RendererServerMessageName.InsertingMatchPositions, onInsertingPositions);
            await client.send({
                name: RendererClientMessageName.GenerateMatchPositions,
                payload: {
                    demoPath: match.demoFilePath,
                    checksum: match.checksum,
                    source: match.source,
                },
            });
            onPositionsAvailable();
            hideDialog();
        }
        catch (error) {
            switch (error) {
                case ErrorCode.DemoNotFound:
                    setError(React.createElement(Trans, null, "Demo not found."));
            }
            setStatus(Status.Error);
        }
        client.off(RendererServerMessageName.InsertingMatchPositions, onInsertingPositions);
    };
    return (React.createElement(Dialog, { closeOnBackgroundClicked: false, closeOnEscPressed: false },
        React.createElement(DialogHeader, null,
            React.createElement(DialogTitle, null,
                React.createElement(Trans, null, "Positions"))),
        React.createElement(DialogContent, null,
            React.createElement("div", { className: "flex max-w-2xl flex-col gap-y-12" },
                React.createElement("p", null,
                    React.createElement(Trans, null, "It will analyze the demo and generate positions required for the 2D viewer.")),
                React.createElement("div", { className: "flex items-center gap-x-4" },
                    React.createElement(ExclamationTriangleIcon, { className: "size-16 shrink-0 text-orange-700" }),
                    React.createElement("p", null,
                        React.createElement(Trans, null, "Positions require disk space, it's recommended to delete them from the database settings when you don't need them anymore."))),
                status === Status.Loading && (React.createElement("div", { className: "flex items-center gap-x-12" },
                    React.createElement(Spinner, { size: 24 }),
                    React.createElement("p", null, message)))),
            status === Status.Error && React.createElement("p", { className: "mt-8" }, error)),
        React.createElement(DialogFooter, null,
            React.createElement(Button, { variant: ButtonVariant.Primary, onClick: onGenerateClick, isDisabled: status === Status.Loading },
                React.createElement(Trans, null, "Generate")),
            React.createElement(CancelButton, { isDisabled: status === Status.Loading, onClick: hideDialog }))));
}
export function NoPositionsFound({ onPositionsAvailable }) {
    const { showDialog } = useDialog();
    const onClick = () => {
        showDialog(React.createElement(GeneratingDialog, { onPositionsAvailable: onPositionsAvailable }));
    };
    return (React.createElement(CenteredContent, null,
        React.createElement("p", { className: "mb-12 text-subtitle" },
            React.createElement(Trans, null, "Positions haven't been generated yet.")),
        React.createElement(Button, { onClick: onClick, variant: ButtonVariant.Primary },
            React.createElement(Trans, null, "Generate positions"))));
}
//# sourceMappingURL=no-positions-found.js.map