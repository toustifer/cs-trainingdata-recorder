import React from 'react';
import { SeePlayerProfileItem } from 'csdm/ui/components/context-menu/items/see-player-profile-item';
import { GeneratePlayerVideoItem } from './generate-player-video-item';
import { ContextMenu } from 'csdm/ui/components/context-menu/context-menu';
import { PinPlayerItem } from 'csdm/ui/components/context-menu/items/pin-player-item';
import { ShowPlayerMatchesItem } from 'csdm/ui/components/context-menu/items/show-player-matches-item';
import { WatchPlayerItem } from 'csdm/ui/components/context-menu/items/watch-player-item';
import { CopyPlayerDataItem } from './copy-player-data-item';
import { OpenSteamProfileItem } from 'csdm/ui/components/context-menu/items/open-steam-profile-item';
import { DetailsItem } from 'csdm/ui/components/context-menu/items/details-item';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { Separator } from 'csdm/ui/components/context-menu/separator';
import { isCounterStrikeStartable, isVideoGenerationAvailable } from 'csdm/ui/hooks/use-counter-strike';
import { useNavigateToMatchPlayer } from 'csdm/ui/hooks/navigation/use-navigate-to-match-player';
import { IgnoreSteamAccountBanItem } from 'csdm/ui/components/context-menu/items/ignore-steam-account-ban-item';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { UpdatePlayerNameDialog } from 'csdm/ui/dialogs/update-player-name-dialog';
import { UpdateNameItem } from 'csdm/ui/components/context-menu/items/update-name-item';
export function ScoreboardContextMenu({ steamId, name, demoPath }) {
    const match = useCurrentMatch();
    const { showDialog } = useDialog();
    const navigateToMatchPlayer = useNavigateToMatchPlayer();
    const canStartCs = isCounterStrikeStartable(match.game);
    const onUpdateNameClick = () => {
        showDialog(React.createElement(UpdatePlayerNameDialog, { steamId: steamId, name: name }));
    };
    return (React.createElement(ContextMenu, null,
        React.createElement(DetailsItem, { onClick: () => {
                navigateToMatchPlayer(match.checksum, steamId);
            } }),
        canStartCs && React.createElement(WatchPlayerItem, { demoPath: demoPath, steamId: steamId, game: match.game }),
        React.createElement(Separator, null),
        React.createElement(SeePlayerProfileItem, { steamId: steamId }),
        React.createElement(ShowPlayerMatchesItem, { steamIds: [steamId] }),
        React.createElement(OpenSteamProfileItem, { steamIds: [steamId] }),
        React.createElement(Separator, null),
        React.createElement(CopyPlayerDataItem, { steamId: steamId }),
        React.createElement(Separator, null),
        isVideoGenerationAvailable(match.game) && React.createElement(GeneratePlayerVideoItem, { steamId: steamId }),
        React.createElement(PinPlayerItem, { steamId: steamId }),
        React.createElement(IgnoreSteamAccountBanItem, { steamId: steamId }),
        React.createElement(UpdateNameItem, { onClick: onUpdateNameClick })));
}
//# sourceMappingURL=scoreboard-context-menu.js.map