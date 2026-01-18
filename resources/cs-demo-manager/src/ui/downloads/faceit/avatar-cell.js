import React from 'react';
import { AvatarCell } from 'csdm/ui/components/table/cells/avatar-cell';
export function FaceitAvatarCell({ data: player }) {
    return React.createElement(AvatarCell, { avatarUrl: player.avatarUrl, playerName: player.name });
}
//# sourceMappingURL=avatar-cell.js.map