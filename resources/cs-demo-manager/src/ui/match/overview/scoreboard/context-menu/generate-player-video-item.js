import React from 'react';
import { Trans } from '@lingui/react/macro';
import { SubContextMenu } from 'csdm/ui/components/context-menu/sub-context-menu';
import { GeneratePlayerKillsVideoItem } from './generate-player-kills-video-item';
import { GeneratePlayerRoundsVideoItem } from './generate-player-rounds-video-item';
import { GeneratePlayerDeathsVideoItem } from './generate-player-deaths-video-item';
export function GeneratePlayerVideoItem({ steamId }) {
    return (React.createElement(SubContextMenu, { label: React.createElement(Trans, { context: "Context menu" }, "Generate video") },
        React.createElement(GeneratePlayerKillsVideoItem, { steamId: steamId }),
        React.createElement(GeneratePlayerDeathsVideoItem, { steamId: steamId }),
        React.createElement(GeneratePlayerRoundsVideoItem, { steamId: steamId })));
}
//# sourceMappingURL=generate-player-video-item.js.map