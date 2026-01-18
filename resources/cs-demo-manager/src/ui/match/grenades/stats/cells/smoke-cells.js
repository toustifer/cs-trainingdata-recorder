import React from 'react';
import { GrenadeName } from 'csdm/common/types/counter-strike';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { Cell } from 'csdm/ui/match/grenades/stats/cells/cell';
import { CellText } from 'csdm/ui/match/grenades/stats/cells/cell-text';
export function SmokeCells({ playerSteamId }) {
    const match = useCurrentMatch();
    const smokeThrownCount = match.shots.filter((shot) => {
        return (shot.playerSteamId === playerSteamId && shot.weaponName === GrenadeName.Smoke && !shot.isPlayerControllingBot);
    }).length;
    return (React.createElement(Cell, null,
        React.createElement(CellText, null, smokeThrownCount)));
}
//# sourceMappingURL=smoke-cells.js.map