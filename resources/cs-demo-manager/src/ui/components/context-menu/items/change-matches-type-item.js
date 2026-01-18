import React from 'react';
import { Trans } from '@lingui/react/macro';
import { DemoType } from 'csdm/common/types/counter-strike';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
import { SubContextMenu } from 'csdm/ui/components/context-menu/sub-context-menu';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useShowToast } from 'csdm/ui/components/toasts/use-show-toast';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { matchesTypeUpdated } from 'csdm/ui/matches/matches-actions';
export function ChangeMatchesTypeItem({ checksums }) {
    const client = useWebSocketClient();
    const showToast = useShowToast();
    const dispatch = useDispatch();
    const updateDemosType = async (type) => {
        try {
            await client.send({
                name: RendererClientMessageName.UpdateMatchesType,
                payload: {
                    checksums,
                    type,
                },
            });
            dispatch(matchesTypeUpdated({ checksums, type }));
        }
        catch (error) {
            showToast({
                id: 'update-matches-type-error',
                content: React.createElement(Trans, null, "An error occurred"),
                type: 'error',
            });
        }
    };
    const onGotvClick = () => {
        updateDemosType(DemoType.GOTV);
    };
    const onPovClick = () => {
        updateDemosType(DemoType.POV);
    };
    return (React.createElement(SubContextMenu, { label: React.createElement(Trans, { context: "Context menu" }, "Change type") },
        React.createElement(ContextMenuItem, { onClick: onGotvClick },
            React.createElement(Trans, { context: "Context menu" }, "GOTV")),
        React.createElement(ContextMenuItem, { onClick: onPovClick },
            React.createElement(Trans, { context: "Context menu" }, "POV"))));
}
//# sourceMappingURL=change-matches-type-item.js.map