import React from 'react';
import { RoundEndReason } from 'csdm/common/types/counter-strike';
import { ExplosionIcon } from 'csdm/ui/icons/explosion-icon';
import { FlagIcon } from 'csdm/ui/icons/flag-icon';
import { EliminationIcon } from 'csdm/ui/icons/elimination-icon';
import { ClockIcon } from 'csdm/ui/icons/clock-icon';
import { DefuserIcon } from 'csdm/ui/icons/weapons/defuser-icon';
import { getTeamColor } from 'csdm/ui/styles/get-team-color';
function getRoundEndReasonIcon(roundEndReason) {
    switch (roundEndReason) {
        case RoundEndReason.TargetBombed:
            return React.createElement(ExplosionIcon, null);
        case RoundEndReason.BombDefused:
            return React.createElement(DefuserIcon, null);
        case RoundEndReason.CtWin:
        case RoundEndReason.TerroristWin:
        case RoundEndReason.TerroristsStopped:
        case RoundEndReason.TerroristsEscaped:
            return React.createElement(EliminationIcon, null);
        case RoundEndReason.TargetSaved:
            return React.createElement(ClockIcon, null);
        case RoundEndReason.CounterTerroristsSurrender:
        case RoundEndReason.TerroristsSurrender:
            return React.createElement(FlagIcon, null);
        default:
            return null;
    }
}
export function RoundEndReasonIcon({ round }) {
    const icon = getRoundEndReasonIcon(round.endReason);
    return (React.createElement("div", { className: "w-20", style: {
            color: getTeamColor(round.winnerSide),
        } }, icon));
}
//# sourceMappingURL=round-end-reason-icon.js.map