import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Button, ButtonVariant } from 'csdm/ui/components/buttons/button';
import { useWebSocketClient } from '../hooks/use-web-socket-client';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useVideoQueuePaused } from './use-is-video-queue-paused';
import { ExclamationTriangleIcon } from '../icons/exclamation-triangle-icon';
export function ResumeOrPauseVideoQueueButton() {
    const client = useWebSocketClient();
    const isPaused = useVideoQueuePaused();
    return (React.createElement(React.Fragment, null,
        React.createElement(Button, { variant: isPaused ? ButtonVariant.Primary : ButtonVariant.Default, onClick: () => {
                client.send({
                    name: isPaused ? RendererClientMessageName.ResumeVideoQueue : RendererClientMessageName.PauseVideoQueue,
                });
            } }, isPaused ? React.createElement(Trans, { context: "Button" }, "Resume") : React.createElement(Trans, { context: "Button" }, "Pause")),
        isPaused && (React.createElement("div", { className: "flex items-center gap-x-8" },
            React.createElement(ExclamationTriangleIcon, { className: "size-16 text-orange-700" }),
            React.createElement("p", null,
                React.createElement(Trans, null, "The video queue is paused!"))))));
}
//# sourceMappingURL=resume-or-pause-video-queue-button.js.map