import React from 'react';
import { SubContextMenu } from 'csdm/ui/components/context-menu/sub-context-menu';
import { Trans } from '@lingui/react/macro';
import { ExportPlayersVoiceItem } from 'csdm/ui/components/context-menu/items/export-players-voice-item';
export function ExportDemosItem({ filepaths }) {
    if (filepaths.length === 0) {
        return null;
    }
    return (React.createElement(SubContextMenu, { label: React.createElement(Trans, { context: "Context menu" }, "Export") },
        React.createElement(ExportPlayersVoiceItem, { demoPaths: filepaths })));
}
//# sourceMappingURL=export-demos-items.js.map