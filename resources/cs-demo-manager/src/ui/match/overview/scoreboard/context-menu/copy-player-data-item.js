import React from 'react';
import { Trans } from '@lingui/react/macro';
import { CopySteamIdItem } from 'csdm/ui/components/context-menu/items/copy-steamid-item';
import { CopyCrosshairShareCode } from './copy-crosshair-share-code-item';
import { CopyCrosshairConfig } from './copy-crosshair-config-item';
import { CopyItem } from 'csdm/ui/components/context-menu/items/copy-item';
export function CopyPlayerDataItem({ steamId }) {
    return (React.createElement(CopyItem, null,
        React.createElement(CopySteamIdItem, { steamIds: [steamId] },
            React.createElement(Trans, null, "Steam ID")),
        React.createElement(CopyCrosshairShareCode, { steamId: steamId }),
        React.createElement(CopyCrosshairConfig, { steamId: steamId })));
}
//# sourceMappingURL=copy-player-data-item.js.map