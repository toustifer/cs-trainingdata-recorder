import React from 'react';
import { AvatarCell } from '../table/cells/avatar-cell';
export function ValveAvatarCell({ data: player }) {
    return React.createElement(AvatarCell, { avatarUrl: player.avatar, playerName: player.name });
}
//# sourceMappingURL=avatar-cell.js.map