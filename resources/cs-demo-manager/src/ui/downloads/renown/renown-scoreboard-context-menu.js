import React from 'react';
import { ContextMenu } from 'csdm/ui/components/context-menu/context-menu';
import { OpenRenownProfileItem } from 'csdm/ui/components/context-menu/items/open-renown-profile-item';
import { OpenLeetifyProfileItem } from 'csdm/ui/components/context-menu/items/open-leetify-profile-item';
export function RenownScoreboardContextMenu({ steamId }) {
    return (React.createElement(ContextMenu, null,
        React.createElement(OpenRenownProfileItem, { steamId: steamId }),
        React.createElement(OpenLeetifyProfileItem, { steamId: steamId })));
}
//# sourceMappingURL=renown-scoreboard-context-menu.js.map