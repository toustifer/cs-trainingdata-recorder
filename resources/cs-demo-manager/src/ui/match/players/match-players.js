import React from 'react';
import { useParams } from 'react-router';
import { Trans, useLingui } from '@lingui/react/macro';
import { Content } from 'csdm/ui/components/content';
import { Message } from 'csdm/ui/components/message';
import { useCurrentMatch } from '../use-current-match';
import { buildMatchPlayerPath } from 'csdm/ui/routes-paths';
import { Avatar } from 'csdm/ui/components/avatar';
import { TabLinks } from 'csdm/ui/components/tabs/tab-links';
import { TabLink } from 'csdm/ui/components/tabs/tab-link';
import { KillsPanel } from './kills-panel';
import { MultiKillsPanel } from 'csdm/ui/components/panels/multi-kills-panel';
import { KillDeathRatioPanel } from 'csdm/ui/components/panels/kill-death-ratio-panel';
import { AverageDamagesPerRoundPanel } from 'csdm/ui/components/panels/average-damages-per-round-panel';
import { HeadshotPanel } from 'csdm/ui/components/panels/headshot-panel';
import { KastPanel } from 'csdm/ui/components/panels/kast-panel';
import { ObjectivesPanel } from 'csdm/ui/components/panels/objectives-panel';
import { WeaponsPanel } from './weapons-panel';
import { UtilitiesPanel } from './utilities-panel';
import { ClutchesPanel } from './clutches-panel';
import { PlayerActionBar } from './player-action-bar';
import { HltvRating2Panel } from 'csdm/ui/components/panels/hltv-rating-2-panel';
import { AverageKillsPerRoundPanel } from 'csdm/ui/components/panels/average-kills-per-round-panel';
import { AverageDeathsPerRoundPanel } from 'csdm/ui/components/panels/average-deaths-per-round-panel';
import { HltvRatingPanel } from 'csdm/ui/components/panels/hltv-rating-panel';
export function MatchPlayers() {
    const { t } = useLingui();
    const match = useCurrentMatch();
    const { steamId } = useParams();
    const player = match.players.find((player) => player.steamId === steamId);
    if (player === undefined) {
        return React.createElement(Message, { message: React.createElement(Trans, null, "Player not found.") });
    }
    const kills = match.kills.filter((kill) => kill.killerSteamId === steamId);
    const deaths = match.kills.filter((kill) => kill.victimSteamId === steamId);
    const sortedPlayers = match.players.toSorted((playerA, playerB) => {
        return playerA.name.localeCompare(playerB.name);
    });
    return (React.createElement(React.Fragment, null,
        React.createElement(TabLinks, null, sortedPlayers.map((player) => {
            return (React.createElement(TabLink, { key: player.steamId, url: buildMatchPlayerPath(match.checksum, player.steamId) },
                React.createElement("div", { className: "flex items-center gap-x-4" },
                    React.createElement(Avatar, { avatarUrl: player.avatar, playerName: player.name, size: 20 }),
                    React.createElement("p", null, player.name))));
        })),
        React.createElement(PlayerActionBar, { player: player }),
        React.createElement(Content, null,
            React.createElement("div", { className: "flex flex-col gap-y-12" },
                React.createElement("div", { className: "flex flex-wrap gap-8" },
                    React.createElement("div", { className: "flex flex-col gap-y-8" },
                        React.createElement(HltvRatingPanel, { hltvRating: player.hltvRating }),
                        React.createElement(HltvRating2Panel, { hltvRating2: player.hltvRating2 })),
                    React.createElement("div", { className: "flex flex-col gap-y-8" },
                        React.createElement(KastPanel, { kast: player.kast })),
                    React.createElement("div", { className: "flex flex-col gap-y-8" },
                        React.createElement(AverageDamagesPerRoundPanel, { averageDamagePerRound: player.averageDamagePerRound }),
                        React.createElement(KillDeathRatioPanel, { killDeathRatio: player.killDeathRatio })),
                    React.createElement("div", { className: "flex flex-col gap-y-8" },
                        React.createElement(AverageKillsPerRoundPanel, { averageKillsPerRound: player.averageKillsPerRound }),
                        React.createElement(AverageDeathsPerRoundPanel, { averageDeathsPerRound: player.averageDeathsPerRound })),
                    React.createElement(HeadshotPanel, { headshotCount: player.headshotCount, headshotPercentage: player.headshotPercentage, killCount: player.killCount, assistCount: player.assistCount, deathCount: player.deathCount }),
                    React.createElement(MultiKillsPanel, { oneKillCount: player.oneKillCount, twoKillCount: player.twoKillCount, threeKillCount: player.threeKillCount, fourKillCount: player.fourKillCount, fiveKillCount: player.fiveKillCount }),
                    React.createElement(UtilitiesPanel, { shots: match.shots, steamId: player.steamId }),
                    React.createElement(ObjectivesPanel, { bombDefusedCount: player.bombDefusedCount, bombPlantedCount: player.bombPlantedCount, hostageRescuedCount: player.hostageRescuedCount })),
                React.createElement("div", { className: "flex flex-wrap gap-8" },
                    React.createElement(KillsPanel, { header: t `Kills`, kills: kills, demoPath: match.demoFilePath, tickrate: match.tickrate, rounds: match.rounds }),
                    React.createElement(KillsPanel, { header: t `Deaths`, kills: deaths, demoPath: match.demoFilePath, tickrate: match.tickrate, rounds: match.rounds }),
                    React.createElement("div", { className: "flex flex-col gap-y-8" },
                        React.createElement(WeaponsPanel, { match: match, player: player, kills: kills }),
                        React.createElement(ClutchesPanel, { clutches: match.clutches, demoPath: match.demoFilePath, game: match.game, playerSteamId: player.steamId, tickrate: match.tickrate })))))));
}
//# sourceMappingURL=match-players.js.map