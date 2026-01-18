import React from 'react';
import { AvatarCell } from 'csdm/ui/components/table/cells/avatar-cell';
export function FiveEPlayAvatarCell({ data: player }) {
    return React.createElement(AvatarCell, { avatarUrl: player.avatarUrl, playerName: player.name });
}
//# sourceMappingURL=5eplay-avatar-cell.js.map