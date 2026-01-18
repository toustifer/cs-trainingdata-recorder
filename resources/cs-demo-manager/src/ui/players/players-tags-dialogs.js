import React from 'react';
import { Trans } from '@lingui/react/macro';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { playersTagsUpdated } from 'csdm/ui/tags/tags-actions';
import { useShowToast } from 'csdm/ui/components/toasts/use-show-toast';
import { TagsDialog } from 'csdm/ui/dialogs/tags-dialog';
export function PlayersTagsDialog({ steamIds, defaultTagIds }) {
    const client = useWebSocketClient();
    const dispatch = useDispatch();
    const showToast = useShowToast();
    const onTagIdsUpdated = async (tagIds) => {
        try {
            const payload = {
                steamIds,
                tagIds,
            };
            await client.send({
                name: RendererClientMessageName.UpdatePlayersTags,
                payload,
            });
            dispatch(playersTagsUpdated({
                steamIds,
                tagIds,
            }));
        }
        catch (error) {
            showToast({
                content: React.createElement(Trans, null, "An error occurred"),
                id: 'players-tags-update-error',
                type: 'error',
            });
        }
    };
    return React.createElement(TagsDialog, { onTagIdsUpdated: onTagIdsUpdated, defaultTagIds: defaultTagIds });
}
//# sourceMappingURL=players-tags-dialogs.js.map