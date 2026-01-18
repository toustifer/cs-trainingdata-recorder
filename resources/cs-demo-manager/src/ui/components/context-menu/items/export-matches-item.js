import React from 'react';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { ExportMatchesAsXlsxDialog } from 'csdm/ui/components/dialogs/export-matches-xlsx-dialog';
import { ExportMatchesToJsonItem } from 'csdm/ui/components/context-menu/items/export-matches-to-json-item';
import { SubContextMenu } from 'csdm/ui/components/context-menu/sub-context-menu';
import { Trans } from '@lingui/react/macro';
import { ExportToXlsxItem } from './export-to-xlsx-item';
import { ExportPlayersVoiceItem } from './export-players-voice-item';
import { ExportChatMessagesItem } from './export-chat-messages-item';
export function ExportMatchesItem({ matches }) {
    const { showDialog } = useDialog();
    if (matches.length === 0) {
        return null;
    }
    const checksums = [];
    const shareCodes = [];
    const filepaths = [];
    const players = [];
    for (const match of matches) {
        checksums.push(match.checksum);
        shareCodes.push(match.shareCode);
        filepaths.push(match.demoFilePath);
        for (const player of match.players) {
            if (!players.some(({ steamId }) => steamId === player.steamId)) {
                players.push(player);
            }
        }
    }
    const onExportToXlsxClick = () => {
        showDialog(React.createElement(ExportMatchesAsXlsxDialog, { matches: matches }));
    };
    return (React.createElement(SubContextMenu, { label: React.createElement(Trans, { context: "Context menu" }, "Export") },
        React.createElement(ExportToXlsxItem, { onClick: onExportToXlsxClick }),
        React.createElement(ExportMatchesToJsonItem, { checksums: checksums }),
        React.createElement(ExportPlayersVoiceItem, { demoPaths: filepaths, players: players }),
        React.createElement(ExportChatMessagesItem, { checksums: checksums })));
}
//# sourceMappingURL=export-matches-item.js.map