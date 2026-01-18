import React from 'react';
import { Trans } from '@lingui/react/macro';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useShowToast } from 'csdm/ui/components/toasts/use-show-toast';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { roundCommentUpdated } from './round-actions';
export function useUpdateRoundComment() {
    const client = useWebSocketClient();
    const showToast = useShowToast();
    const dispatch = useDispatch();
    return async (payload) => {
        try {
            await client.send({
                name: RendererClientMessageName.UpdateRoundComment,
                payload,
            });
            dispatch(roundCommentUpdated(payload));
        }
        catch (error) {
            showToast({
                content: React.createElement(Trans, null, "An error occurred"),
                id: 'comment-update-error',
                type: 'error',
            });
        }
    };
}
//# sourceMappingURL=use-update-round-comment.js.map