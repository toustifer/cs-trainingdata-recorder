import React from 'react';
import { BansCell as CommonBansCell } from 'csdm/ui/components/table/cells/bans-cell';
export function BansCell({ data: match }) {
    return (React.createElement(CommonBansCell, { showVacBanned: match.bannedPlayerCount > 0, showGameBanned: false, showCommunityBanned: false }));
}
//# sourceMappingURL=bans-cell.js.map