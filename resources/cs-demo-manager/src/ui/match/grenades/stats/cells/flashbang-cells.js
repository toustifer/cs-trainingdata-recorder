import React from 'react';
import { GrenadeName } from 'csdm/common/types/counter-strike';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { roundNumber } from 'csdm/common/math/round-number';
import { Cell } from 'csdm/ui/match/grenades/stats/cells/cell';
import { CellText } from 'csdm/ui/match/grenades/stats/cells/cell-text';
export function FlashbangCells({ playerSteamId }) {
    const match = useCurrentMatch();
    const flashbangThrownCount = match.shots.filter((shot) => {
        return (shot.playerSteamId === playerSteamId && shot.weaponName === GrenadeName.Flashbang && !shot.isPlayerControllingBot);
    }).length;
    const playerBlinds = match.blinds.filter((blind) => {
        return (blind.flasherSteamId === playerSteamId &&
            blind.flashedSide !== blind.flasherSide &&
            !blind.isFlasherControllingBot);
    });
    const flashDuration = playerBlinds.reduce((previousDuration, { duration }) => {
        return previousDuration + duration;
    }, 0);
    let playerFlashedPerThrow = 0;
    if (flashbangThrownCount > 0) {
        playerFlashedPerThrow = roundNumber(playerBlinds.length / flashbangThrownCount, 2);
    }
    const roundCount = match.rounds.length;
    let playerFlashedPerRound = 0;
    if (roundCount > 0) {
        playerFlashedPerRound = roundNumber(playerBlinds.length / roundCount, 2);
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(Cell, null,
            React.createElement(CellText, null, flashbangThrownCount)),
        React.createElement(Cell, null,
            React.createElement(CellText, null, roundNumber(flashDuration, 2))),
        React.createElement(Cell, null,
            React.createElement(CellText, null, playerBlinds.length)),
        React.createElement(Cell, null,
            React.createElement(CellText, null, playerFlashedPerThrow)),
        React.createElement(Cell, null,
            React.createElement(CellText, null, playerFlashedPerRound))));
}
//# sourceMappingURL=flashbang-cells.js.map