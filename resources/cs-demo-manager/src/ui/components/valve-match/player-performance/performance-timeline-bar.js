import React from 'react';
import clsx from 'clsx';
import { EliminationIcon } from 'csdm/ui/icons/elimination-icon';
import { StarIcon } from 'csdm/ui/icons/star-icon';
import { EliminationHeadshotIcon } from 'csdm/ui/icons/elimination-headshot-icon';
import { hexToRgba } from 'csdm/ui/shared/colors';
import { getTeamColor } from 'csdm/ui/styles/get-team-color';
import { useContextMenu } from 'csdm/ui/components/context-menu/use-context-menu';
import { RoundContextMenu } from './round-context-menu';
import { Game } from 'csdm/common/types/counter-strike';
function DeathElimination({ deathCount }) {
    return React.createElement(EliminationIcon, { height: 32, className: "text-red-600", opacity: deathCount === 0 ? 0 : 1 });
}
export function PerformanceTimeLineBar({ round, demoPath, game }) {
    const regularKillCount = round.killCount - round.headshotCount;
    const headshotKillCount = round.headshotCount;
    const hiddenCount = 5 - regularKillCount - headshotKillCount;
    const color = getTeamColor(round.teamNumber);
    const { showContextMenu } = useContextMenu();
    // TODO CS2 Allow it when the playdemo command in CS2 supports the startround argument
    const canOpenContextMenu = demoPath !== undefined && game === Game.CSGO;
    const showRoundContextMenu = (event) => {
        if (!canOpenContextMenu) {
            return;
        }
        event.stopPropagation();
        showContextMenu(event.nativeEvent, React.createElement(RoundContextMenu, { round: round, demoPath: demoPath }));
    };
    return (React.createElement("div", { className: clsx('flex flex-col', {
            'from-gray-300 hover:bg-linear-to-t': canOpenContextMenu,
        }), onContextMenu: showRoundContextMenu, onClick: showRoundContextMenu },
        React.createElement("div", { className: "relative flex flex-1 flex-col pb-12", style: {
                color,
                background: round.hasWon
                    ? `linear-gradient(to top, ${hexToRgba(color, 0.8)} 0%, ${hexToRgba(color, 0.2)} 2%, ${hexToRgba(color, 0.03)} 60%, ${hexToRgba(color, 0)} 100%)`
                    : 'none',
            } },
            Array.from({ length: hiddenCount })
                .fill(0)
                .map((value, index) => {
                return React.createElement(EliminationIcon, { key: `hidden-${round.number}-${index}`, opacity: 0, height: 32 });
            }),
            regularKillCount > 0 &&
                Array.from({ length: regularKillCount })
                    .fill(0)
                    .map((value, index) => {
                    return React.createElement(EliminationIcon, { key: `elimination-${round.number}-${index}`, height: 32, color: color });
                }),
            headshotKillCount > 0 &&
                Array.from({ length: headshotKillCount })
                    .fill(0)
                    .map((value, index) => {
                    return React.createElement(EliminationHeadshotIcon, { key: `hs-${round.number}-${index}`, height: 32, color: color });
                }),
            round.mvpCount > 0 && (React.createElement("div", { className: "absolute -bottom-12" },
                React.createElement(StarIcon, { height: 32, color: color })))),
        React.createElement("div", { className: clsx(`pt-12 opacity-25`, {
                'bg-linear-to-b from-red-600 via-transparent': round.deathCount > 0,
            }) },
            React.createElement(DeathElimination, { deathCount: round.deathCount })),
        React.createElement("p", { className: "self-center" }, round.number)));
}
//# sourceMappingURL=performance-timeline-bar.js.map