import React from 'react';
import { ActionBar } from 'csdm/ui/components/action-bar';
import { PlayerFilterDropdown } from './player-filter-dropdown';
import { PlayerSteamLink } from './player-steam-link';
import { useUnsafePlayer } from './use-unsafe-player';
import { Tags } from 'csdm/ui/components/tags/tags';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { PlayersTagsDialog } from 'csdm/ui/players/players-tags-dialogs';
import { ExportPlayerAsXlsxButton } from './export-player-as-xlsx-button';
function Left({ player }) {
    const { showDialog } = useDialog();
    const onEditTagsClick = () => {
        showDialog(React.createElement(PlayersTagsDialog, { steamIds: [player.steamId], defaultTagIds: player.tagIds }));
    };
    return (React.createElement("div", { className: "flex items-center gap-x-8" },
        React.createElement(PlayerSteamLink, { player: player }),
        React.createElement(Tags, { tagIds: player.tagIds, onEditClick: onEditTagsClick })));
}
export function PlayerActionBar() {
    const player = useUnsafePlayer();
    return (React.createElement(ActionBar, { left: player && React.createElement(Left, { player: player }), right: React.createElement(React.Fragment, null,
            React.createElement(ExportPlayerAsXlsxButton, null),
            React.createElement(PlayerFilterDropdown, null)) }));
}
//# sourceMappingURL=player-action-bar.js.map