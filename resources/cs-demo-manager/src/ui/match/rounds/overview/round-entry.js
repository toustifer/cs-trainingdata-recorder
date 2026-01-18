import React, {} from 'react';
import { Trans } from '@lingui/react/macro';
import { PlayDemoAtTickButton } from '../play-demo-at-tick-button';
import { Avatar as AvatarImage } from 'csdm/ui/components/avatar';
import { useCurrentMatch } from '../../use-current-match';
import { KillFeedEntry } from 'csdm/ui/components/kill-feed-entry';
import { TeamText } from 'csdm/ui/components/team-text';
import { RoundEndReasonIcon } from 'csdm/ui/icons/round-end-reason-icon';
import { getTeamColor } from 'csdm/ui/styles/get-team-color';
import { CollapsePanel } from 'csdm/ui/components/collapse-panel/collapse-panel';
import { useTranslateEconomyType } from '../../economy/team-economy-breakdown/use-translate-economy-type';
import { useFormatMoney } from 'csdm/ui/hooks/use-format-money';
import { RoundCommentInput } from 'csdm/ui/match/rounds/round/round-comment-input';
import { RoundCommentIcon } from '../round/round-comment-icon';
function Avatars({ players, kills }) {
    return (React.createElement("div", { className: "flex gap-x-4" }, players.map((player) => {
        const hasBeenKilled = kills.some((kill) => {
            return kill.victimSteamId === player.steamId;
        });
        const playerKills = kills.filter((kill) => {
            return kill.killerSteamId === player.steamId;
        });
        return (React.createElement("div", { key: player.steamId, style: {
                opacity: hasBeenKilled ? 0.3 : 1,
            } },
            React.createElement(AvatarImage, { avatarUrl: player.avatar, playerName: player.name, size: 44, playerColor: player.color }),
            React.createElement("div", { className: "mt-px flex gap-x-px" }, playerKills.map((kill) => {
                return (React.createElement("div", { key: kill.id, className: "size-8 rounded", style: {
                        backgroundColor: getTeamColor(kill.killerSide),
                    } }));
            }))));
    })));
}
function Row({ valueTeamA, valueTeamB, title }) {
    return (React.createElement("div", { className: "grid grid-cols-[minmax(60px,auto)_1fr_minmax(60px,auto)] gap-8 whitespace-nowrap" },
        React.createElement("p", { className: "text-left" }, valueTeamA),
        React.createElement("p", { className: "text-center" }, title),
        React.createElement("p", { className: "text-right" }, valueTeamB)));
}
function Content({ round, kills, roundFreezetimeEndTick }) {
    const match = useCurrentMatch();
    const { translateEconomyType } = useTranslateEconomyType();
    const formatMoney = useFormatMoney();
    return (React.createElement("div", { className: "flex w-full gap-x-16" },
        React.createElement("div", null, kills.map((kill) => {
            return (React.createElement(KillFeedEntry, { key: kill.id, kill: kill, timeElapsedOption: {
                    roundFreezetimeEndTick: roundFreezetimeEndTick,
                    tickrate: match.tickrate,
                } }));
        })),
        React.createElement("div", null,
            React.createElement(Row, { title: React.createElement(Trans, null, "Cash"), valueTeamA: formatMoney(round.teamAStartMoney), valueTeamB: formatMoney(round.teamBStartMoney) }),
            React.createElement(Row, { title: React.createElement(Trans, null, "Cash spent"), valueTeamA: formatMoney(round.teamAMoneySpent), valueTeamB: formatMoney(round.teamBMoneySpent) }),
            React.createElement(Row, { title: React.createElement(Trans, null, "Equipment value"), valueTeamA: formatMoney(round.teamAEquipmentValue), valueTeamB: formatMoney(round.teamBEquipmentValue) }),
            React.createElement(Row, { title: React.createElement(Trans, null, "Economy type"), valueTeamA: translateEconomyType(round.teamAEconomyType), valueTeamB: translateEconomyType(round.teamBEconomyType) })),
        React.createElement("div", { className: "ml-auto max-h-[160px] w-full max-w-[512px]" },
            React.createElement(RoundCommentInput, { checksum: round.matchChecksum, number: round.number, comment: round.comment }))));
}
function PanelHeader({ round, playersTeamA, playersTeamB, kills, match }) {
    const roundNumber = round.number;
    const bombExploded = match.bombsExploded.find((bomb) => bomb.roundNumber === roundNumber);
    const bombDefused = match.bombsDefused.find((bomb) => bomb.roundNumber === roundNumber);
    const bombEventSite = bombExploded?.site || bombDefused?.site;
    return (React.createElement(React.Fragment, null,
        React.createElement("div", { className: "flex items-center gap-x-8" },
            React.createElement("p", { className: "text-body-strong" },
                React.createElement(Trans, null,
                    "Round ",
                    roundNumber)),
            round.comment ? React.createElement(RoundCommentIcon, { comment: round.comment }) : React.createElement("div", { className: "size-16" })),
        React.createElement("div", { className: "flex flex-1 items-center justify-center" },
            React.createElement(Avatars, { players: playersTeamA, kills: kills }),
            React.createElement(TeamText, { teamNumber: round.teamASide, className: "mx-8 text-title" }, round.teamAScore),
            React.createElement("div", { className: "flex flex-col items-center" },
                React.createElement(RoundEndReasonIcon, { round: round }),
                bombEventSite && (React.createElement("p", { className: "text-subtitle", style: {
                        color: getTeamColor(round.winnerSide),
                    } }, bombEventSite))),
            React.createElement(TeamText, { teamNumber: round.teamBSide, className: "mx-8 text-title" }, round.teamBScore),
            React.createElement(Avatars, { players: playersTeamB, kills: kills })),
        React.createElement(PlayDemoAtTickButton, { demoPath: match.demoFilePath, game: match.game, tick: round.startTick, tooltip: React.createElement(Trans, { context: "Tooltip" }, "Watch round") })));
}
export function RoundEntry({ round }) {
    const match = useCurrentMatch();
    const playersTeamA = match.players.filter((player) => player.teamName === match.teamA.name);
    const playersTeamB = match.players.filter((player) => player.teamName === match.teamB.name);
    const kills = match.kills.filter((kill) => kill.roundNumber === round.number);
    return (React.createElement("div", null,
        React.createElement(CollapsePanel, { header: React.createElement(PanelHeader, { kills: kills, match: match, round: round, playersTeamA: playersTeamA, playersTeamB: playersTeamB }) },
            React.createElement(Content, { round: round, kills: kills, roundFreezetimeEndTick: round.freezetimeEndTick }))));
}
//# sourceMappingURL=round-entry.js.map