import React from 'react';
import { AvatarCell } from 'csdm/ui/components/table/cells/avatar-cell';
export function PlayerAvatarCell({ data: player }) {
    return React.createElement(AvatarCell, { avatarUrl: player.avatar, playerName: player.name });
}
//# sourceMappingURL=player-avatar-cell.js.map