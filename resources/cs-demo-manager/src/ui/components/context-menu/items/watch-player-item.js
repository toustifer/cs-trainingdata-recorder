import React from 'react';
import { Trans } from '@lingui/react/macro';
import { SubContextMenu } from 'csdm/ui/components/context-menu/sub-context-menu';
import { WatchPlayerHighlightsItem } from './watch-player-highlights-item';
import { WatchPlayerLowlightsItem } from './watch-player-lowlights-item';
import { WatchPlayerAsSuspectItem } from './watch-player-as-suspect-item';
import { Game } from 'csdm/common/types/counter-strike';
import { WatchPlayerRoundsItem } from './watch-player-rounds-item';
export function WatchPlayerItem({ demoPath, steamId, game }) {
    return (React.createElement(SubContextMenu, { label: React.createElement(Trans, { context: "Context menu" }, "Watch") },
        React.createElement(WatchPlayerRoundsItem, { steamId: steamId, demoPath: demoPath }),
        React.createElement(WatchPlayerHighlightsItem, { steamId: steamId, demoPath: demoPath, game: game }),
        React.createElement(WatchPlayerLowlightsItem, { steamId: steamId, demoPath: demoPath, game: game }),
        game === Game.CSGO && React.createElement(WatchPlayerAsSuspectItem, { steamId: steamId, demoPath: demoPath })));
}
//# sourceMappingURL=watch-player-item.js.map