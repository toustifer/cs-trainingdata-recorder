import React from 'react';
import { ContextMenu } from 'csdm/ui/components/context-menu/context-menu';
import { NavigateToPlayerItem } from '../../components/context-menu/items/navigate-to-player-item';
import { PinPlayerItem } from 'csdm/ui/components/context-menu/items/pin-player-item';
import { CopySteamIdItem } from 'csdm/ui/components/context-menu/items/copy-steamid-item';
import { OpenSteamProfileItem } from 'csdm/ui/components/context-menu/items/open-steam-profile-item';
import { CommentItem } from 'csdm/ui/components/context-menu/items/comment-item';
import { TagsItem } from 'csdm/ui/components/context-menu/items/tags-item';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { PlayersTagsDialog } from '../players-tags-dialogs';
import { Separator } from 'csdm/ui/components/context-menu/separator';
import { UpdateNameItem } from 'csdm/ui/components/context-menu/items/update-name-item';
import { UpdatePlayerNameDialog } from 'csdm/ui/dialogs/update-player-name-dialog';
import { ExportPlayersItem } from './export-players-item';
import { lastArrayItem } from 'csdm/common/array/last-array-item';
export function PlayerContextMenu({ players, onCommentClick }) {
    const { showDialog } = useDialog();
    if (players.length === 0) {
        return null;
    }
    const playerSteamIds = players.map((player) => player.steamId);
    const selectedPlayerSteamId = lastArrayItem(playerSteamIds);
    const isMultipleSelection = playerSteamIds.length > 1;
    const onTagsClick = () => {
        const tagIds = players.flatMap((player) => player.tagIds);
        showDialog(React.createElement(PlayersTagsDialog, { steamIds: playerSteamIds, defaultTagIds: tagIds }));
    };
    const onUpdateNameClick = () => {
        const [player] = players;
        showDialog(React.createElement(UpdatePlayerNameDialog, { steamId: player.steamId, name: player.name }));
    };
    return (React.createElement(ContextMenu, null,
        React.createElement(NavigateToPlayerItem, { steamId: selectedPlayerSteamId }),
        React.createElement(Separator, null),
        !isMultipleSelection && React.createElement(CommentItem, { onClick: onCommentClick }),
        React.createElement(TagsItem, { onClick: onTagsClick }),
        React.createElement(Separator, null),
        React.createElement(CopySteamIdItem, { steamIds: playerSteamIds }),
        React.createElement(OpenSteamProfileItem, { steamIds: playerSteamIds }),
        React.createElement(PinPlayerItem, { steamId: selectedPlayerSteamId }),
        !isMultipleSelection && React.createElement(UpdateNameItem, { onClick: onUpdateNameClick }),
        React.createElement(ExportPlayersItem, { steamIds: playerSteamIds })));
}
//# sourceMappingURL=player-context-menu.js.map