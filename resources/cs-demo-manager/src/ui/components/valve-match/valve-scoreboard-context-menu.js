import React from 'react';
import { ContextMenu } from 'csdm/ui/components/context-menu/context-menu';
import { PinPlayerItem } from 'csdm/ui/components/context-menu/items/pin-player-item';
import { ShowPlayerMatchesItem } from 'csdm/ui/components/context-menu/items/show-player-matches-item';
import { WatchPlayerItem } from 'csdm/ui/components/context-menu/items/watch-player-item';
import { OpenSteamProfileItem } from 'csdm/ui/components/context-menu/items/open-steam-profile-item';
import { SeePlayerProfileItem } from 'csdm/ui/components/context-menu/items/see-player-profile-item';
import { CopySteamIdItem } from '../context-menu/items/copy-steamid-item';
import { Game } from 'csdm/common/types/counter-strike';
import { isCounterStrikeStartable } from 'csdm/ui/hooks/use-counter-strike';
export function ValveScoreboardContextMenu({ steamId, demoPath, game }) {
    const canStartCs = isCounterStrikeStartable(game);
    const canWatchPlayer = demoPath && canStartCs && game === Game.CSGO;
    return (React.createElement(ContextMenu, null,
        React.createElement(SeePlayerProfileItem, { steamId: steamId }),
        canWatchPlayer && React.createElement(WatchPlayerItem, { demoPath: demoPath, steamId: steamId, game: game }),
        React.createElement(CopySteamIdItem, { steamIds: [steamId] }),
        React.createElement(ShowPlayerMatchesItem, { steamIds: [steamId] }),
        React.createElement(OpenSteamProfileItem, { steamIds: [steamId] }),
        React.createElement(PinPlayerItem, { steamId: steamId })));
}
//# sourceMappingURL=valve-scoreboard-context-menu.js.map