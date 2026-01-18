import React from 'react';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { Panel } from 'csdm/ui/components/panel';
import { Trans } from '@lingui/react/macro';
import { useCurrentRound } from './use-current-round';
import { Button } from 'csdm/ui/components/buttons/button';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { Tag, TagsTooltip } from 'csdm/ui/components/tags/tag';
import { Tooltip } from 'csdm/ui/components/tooltip';
import { TagsDialog } from 'csdm/ui/dialogs/tags-dialog';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { useShowToast } from 'csdm/ui/components/toasts/use-show-toast';
import { roundTagsUpdated } from 'csdm/ui/tags/tags-actions';
export function RoundTags() {
    const client = useWebSocketClient();
    const dispatch = useDispatch();
    const showToast = useShowToast();
    const { showDialog } = useDialog();
    const { checksum } = useCurrentMatch();
    const round = useCurrentRound();
    const { tagIds } = round;
    const visibleTagIds = tagIds.slice(0, 10);
    const hiddenTagIds = tagIds.slice(10);
    const onTagIdsUpdated = async (tagIds) => {
        try {
            const payload = {
                checksum,
                roundNumber: round.number,
                tagIds,
            };
            await client.send({
                name: RendererClientMessageName.UpdateRoundTags,
                payload,
            });
            dispatch(roundTagsUpdated({
                checksum,
                roundNumber: round.number,
                tagIds,
            }));
        }
        catch (error) {
            showToast({
                content: React.createElement(Trans, null, "An error occurred."),
                id: 'update-round-tags-error',
                type: 'error',
            });
        }
    };
    const onEditClick = () => {
        showDialog(React.createElement(TagsDialog, { onTagIdsUpdated: onTagIdsUpdated, defaultTagIds: tagIds }));
    };
    return (React.createElement("div", { className: "max-w-[312px]" },
        React.createElement(Panel, { header: React.createElement("div", { className: "flex justify-between" },
                React.createElement(Trans, { context: "Panel title" }, "Tags"),
                React.createElement(Button, { onClick: onEditClick },
                    React.createElement(Trans, { context: "Button" }, "Edit"))) },
            React.createElement("div", { className: "flex flex-wrap items-center gap-x-8 gap-y-4" },
                visibleTagIds.length === 0 ? (React.createElement("p", null,
                    React.createElement(Trans, null, "No tags"))) : (visibleTagIds.map((tagId) => {
                    return React.createElement(Tag, { key: tagId, id: tagId });
                })),
                hiddenTagIds.length > 0 && (React.createElement(Tooltip, { content: React.createElement(TagsTooltip, { tagIds: hiddenTagIds }) },
                    React.createElement("div", { className: "flex items-center justify-center rounded border border-transparent bg-gray-75 px-8 py-4" },
                        React.createElement("p", { className: "text-caption" },
                            "+",
                            hiddenTagIds.length))))))));
}
//# sourceMappingURL=round-tags.js.map