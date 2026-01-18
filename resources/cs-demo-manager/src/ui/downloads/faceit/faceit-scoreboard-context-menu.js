import React from 'react';
import { ContextMenu } from 'csdm/ui/components/context-menu/context-menu';
import { OpenFaceitProfileItem } from 'csdm/ui/components/context-menu/items/open-faceit-profile-item';
export function FaceitScoreboardContextMenu({ playerNickname }) {
    return (React.createElement(ContextMenu, null,
        React.createElement(OpenFaceitProfileItem, { nickname: playerNickname })));
}
//# sourceMappingURL=faceit-scoreboard-context-menu.js.map