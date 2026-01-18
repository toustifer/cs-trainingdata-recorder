import React from 'react';
import { BansCell as CommonBansCell } from 'csdm/ui/components/table/cells/bans-cell';
export function BansCell({ data: { lastBanDate } }) {
    return React.createElement(CommonBansCell, { showVacBanned: lastBanDate !== null, showGameBanned: false, showCommunityBanned: false });
}
//# sourceMappingURL=bans-cell.js.map