import React from 'react';
import { Trans } from '@lingui/react/macro';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { useSelectedAnalysis } from 'csdm/ui/analyses/use-selected-analysis-demo-id';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
export function RemoveDemoFromAnalysesItem() {
    const selectedAnalysis = useSelectedAnalysis();
    const client = useWebSocketClient();
    const onClick = () => {
        if (selectedAnalysis === undefined) {
            return;
        }
        client.send({
            name: RendererClientMessageName.RemoveDemosFromAnalyses,
            payload: [selectedAnalysis.demoChecksum],
        });
    };
    return (React.createElement(ContextMenuItem, { onClick: onClick },
        React.createElement(Trans, { context: "Context menu" }, "Remove")));
}
//# sourceMappingURL=remove-demo-from-analyses-item.js.map