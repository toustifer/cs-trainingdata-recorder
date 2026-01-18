import React, { useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { Tooltip } from 'csdm/ui/components/tooltip';
import { Avatar } from 'csdm/ui/components/avatar';
import { Content } from 'csdm/ui/components/content';
import { OpeningDuelResult } from 'csdm/common/types/opening-duel-result';
import { OpeningDuelResultSelect } from 'csdm/ui/components/inputs/select/opening-duel-result-select';
import { roundNumberPercentage } from 'csdm/common/math/round-number-percentage';
import { SideSelect } from 'csdm/ui/components/inputs/select/side-select';
import { getCssVariableValue } from 'csdm/ui/shared/get-css-variable-value';
import { OpeningDuelsRoundBreakdown } from './opening-duels-round-breakdown';
import { Section } from 'csdm/ui/components/section';
function TeamChart({ teamName, players, kills, result, sides }) {
    const playersStats = [];
    let openDuelTeamWonCount = 0;
    let openDuelTeamLostCount = 0;
    let openDuelTeamCount = 0;
    for (const player of players) {
        let wonCount = 0;
        if (!result || result === OpeningDuelResult.Won) {
            wonCount = kills.filter((kill) => {
                return kill.killerSteamId === player.steamId && (sides.length === 0 || sides.includes(kill.killerSide));
            }).length;
        }
        let lostCount = 0;
        if (!result || result === OpeningDuelResult.Lost) {
            lostCount = kills.filter((kill) => {
                return kill.victimSteamId === player.steamId && (sides.length === 0 || sides.includes(kill.victimSide));
            }).length;
        }
        playersStats.push({
            steamId: player.steamId,
            name: player.name,
            avatar: player.avatar,
            wonCount,
            lostCount,
        });
        openDuelTeamWonCount += wonCount;
        openDuelTeamLostCount += lostCount;
        const total = wonCount + lostCount;
        openDuelTeamCount += total;
        const maxOpenKillCountTeam = Number.parseFloat(getCssVariableValue('--max-opening-duel-count'));
        if (isNaN(maxOpenKillCountTeam) || maxOpenKillCountTeam < total) {
            document.documentElement.style.setProperty('--max-opening-duel-count', String(total));
        }
    }
    const openDuelWonPercentage = roundNumberPercentage(openDuelTeamWonCount / openDuelTeamCount);
    const openDuelLostPercentage = roundNumberPercentage(openDuelTeamLostCount / openDuelTeamCount);
    return (React.createElement("div", { className: "flex flex-col rounded border border-gray-300 bg-gray-75 p-8" },
        React.createElement("div", { className: "flex flex-col" },
            React.createElement("div", { className: "flex justify-between" },
                React.createElement("p", { className: "text-body-strong" }, teamName),
                React.createElement("p", { className: "text-subtitle" }, openDuelTeamCount)),
            React.createElement("div", { className: "my-4 flex w-full gap-x-4" },
                React.createElement("div", { className: "h-4 rounded-full bg-blue-700 transition-all duration-300", style: {
                        width: `${openDuelWonPercentage}%`,
                    } }),
                React.createElement("div", { className: "h-4 rounded-full bg-red-700 transition-all duration-300", style: {
                        width: `${openDuelLostPercentage}%`,
                    } })),
            React.createElement("div", { className: "flex justify-between gap-x-8" },
                React.createElement("div", { className: "flex flex-col" },
                    React.createElement("p", { className: "text-subtitle text-blue-700" },
                        React.createElement(Trans, null,
                            openDuelWonPercentage,
                            "%")),
                    React.createElement("p", null,
                        React.createElement(Trans, null, "Opening duels won"))),
                React.createElement("div", { className: "flex flex-col" },
                    React.createElement("p", { className: "text-right text-subtitle text-red-700" },
                        React.createElement(Trans, null,
                            openDuelLostPercentage,
                            "%")),
                    React.createElement("p", null,
                        React.createElement(Trans, null, "Opening duels lost"))))),
        React.createElement("div", { className: "mt-8 flex justify-center gap-x-12" }, playersStats.map(({ steamId, avatar, name, wonCount, lostCount }) => {
            const openingDuelCount = wonCount + lostCount;
            return (React.createElement("div", { key: steamId, className: "flex" },
                React.createElement("div", { className: "flex flex-col items-center" },
                    React.createElement("div", { className: "flex h-[284px] flex-col items-center justify-end gap-y-4" },
                        lostCount > 0 && (React.createElement(Tooltip, { content: React.createElement(Trans, null,
                                "Open duels lost: ",
                                lostCount), placement: "top" },
                            React.createElement("div", { className: "flex w-40 animate-grow-height justify-center bg-red-700 transition-all duration-300", style: {
                                    height: `calc(${lostCount}/var(--max-opening-duel-count) * 100%)`,
                                } },
                                React.createElement("span", { className: "text-white" }, lostCount)))),
                        wonCount > 0 && (React.createElement(Tooltip, { content: React.createElement(Trans, null,
                                "Open duels won: ",
                                wonCount), placement: "top" },
                            React.createElement("div", { className: "flex w-40 animate-grow-height justify-center bg-blue-700 transition-all duration-300", style: {
                                    height: `calc(${wonCount}/var(--max-opening-duel-count) * 100%)`,
                                } },
                                React.createElement("span", { className: "text-white" }, wonCount))))),
                    React.createElement("div", { className: "flex flex-col items-center" },
                        React.createElement(Tooltip, { content: React.createElement(Trans, null,
                                "Open duels: ",
                                React.createElement("strong", null, openingDuelCount)), placement: "top" },
                            React.createElement("div", { className: "my-4 w-40 border border-gray-400 p-4 text-center text-body-strong" },
                                React.createElement("p", null, openingDuelCount))),
                        React.createElement(Avatar, { avatarUrl: avatar, playerName: name, size: 48 }),
                        React.createElement("p", { className: "w-[72px] truncate text-center", title: name }, name)))));
        }))));
}
export function OpeningDuelsStats() {
    const match = useCurrentMatch();
    const teamNameA = match.teamA.name;
    const teamNameB = match.teamB.name;
    const playersTeamA = match.players.filter((player) => player.teamName === teamNameA);
    const playersTeamB = match.players.filter((player) => player.teamName === teamNameB);
    const [selectedResult, setSelectedResult] = useState(undefined);
    const [selectedSides, setSelectedSides] = useState([]);
    const openingKills = [];
    for (const kill of match.kills) {
        if (openingKills.some((k) => k.roundNumber === kill.roundNumber)) {
            continue;
        }
        openingKills.push(kill);
    }
    return (React.createElement(Content, null,
        React.createElement("div", { className: "flex flex-wrap gap-16" },
            React.createElement("div", { className: "flex flex-col" },
                React.createElement("div", { className: "flex items-center gap-16" },
                    React.createElement(OpeningDuelResultSelect, { selectedResult: selectedResult, onChange: (result) => {
                            setSelectedResult(result);
                        } }),
                    React.createElement(SideSelect, { selectedSides: selectedSides, onChange: (side) => {
                            setSelectedSides(side === undefined ? [] : [side]);
                        } })),
                React.createElement("div", { className: "mt-12 flex items-center gap-x-16" },
                    React.createElement(TeamChart, { teamName: teamNameA, players: playersTeamA, kills: openingKills, result: selectedResult, sides: selectedSides }),
                    React.createElement(TeamChart, { teamName: teamNameB, players: playersTeamB, kills: openingKills, result: selectedResult, sides: selectedSides }))),
            React.createElement(Section, { title: React.createElement(Trans, null, "Round breakdown") },
                React.createElement(OpeningDuelsRoundBreakdown, { openingKills: openingKills })))));
}
//# sourceMappingURL=opening-duels-stats.js.map