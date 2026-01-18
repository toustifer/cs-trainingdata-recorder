import React from 'react';
import { BansCell as CommonBansCell } from 'csdm/ui/components/table/cells/bans-cell';
export function BansCell({ data: player }) {
    return (React.createElement(CommonBansCell, { showVacBanned: player.isVacBanned, showGameBanned: player.isGameBanned, showCommunityBanned: player.isCommunityBanned }));
}
//# sourceMappingURL=bans-cell.js.map