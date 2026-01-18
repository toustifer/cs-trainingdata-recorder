import React from 'react';
import { AvatarCell } from 'csdm/ui/components/table/cells/avatar-cell';
export function ScoreboardAvatarCell({ data: player }) {
    return React.createElement(AvatarCell, { playerColor: player.color, avatarUrl: player.avatar, playerName: player.name });
}
//# sourceMappingURL=scoreboard-avatar-cell.js.map