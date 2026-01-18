import React from 'react';
import { createHashRouter, createRoutesFromElements, Route } from 'react-router';
import { Root } from 'csdm/ui/bootstrap/root';
import { Downloads } from 'csdm/ui/downloads/downloads';
import { Matches } from 'csdm/ui/matches/matches';
import { Demos } from 'csdm/ui/demos/demos';
import { Analyses } from 'csdm/ui/analyses/analyses';
import { DemoLoader } from 'csdm/ui/demo/demo-loader';
import { PlayerMaps } from 'csdm/ui/player/maps/player-maps';
import { Players } from 'csdm/ui/players/players';
import { Player } from 'csdm/ui/player/player';
import { PinnedPlayer } from 'csdm/ui/player/pinned-player';
import { PlayerOverview } from 'csdm/ui/player/overview/player-overview';
import { PlayerCharts } from 'csdm/ui/player/charts/player-charts';
import { PlayerMatchesTable } from 'csdm/ui/player/matches/player-matches-table';
import { MatchLoader } from 'csdm/ui/match/match-loader';
import { MatchOverview } from 'csdm/ui/match/overview/match-overview';
import { Rounds } from 'csdm/ui/match/rounds/overview/rounds';
import { Round } from 'csdm/ui/match/rounds/round/round';
import { MatchHeatmap } from 'csdm/ui/match/heatmap/match-heatmap';
import { MatchGrenades } from 'csdm/ui/match/grenades/match-grenades';
import { Viewer2DLoader } from 'csdm/ui/match/viewer-2d/viewer-2d-loader';
import { VideoLoader } from 'csdm/ui/match/video/video-loader';
import { ChatMessages } from 'csdm/ui/match/chat-messages/chat-messages';
import { Economy } from 'csdm/ui/match/economy/economy';
import { Weapons } from 'csdm/ui/match/weapons/weapons';
import { LastMatchesLoader as ValveLastMatchesLoader } from 'csdm/ui/downloads/valve/last-matches-loader';
import { PendingDownloads } from 'csdm/ui/downloads/pending/pending-downloads';
import { GrenadesStats } from 'csdm/ui/match/grenades/stats/grenades-stats';
import { GrenadesFinderLoader } from 'csdm/ui/match/grenades/finder/grenades-finder-loader';
import { LastMatches as FaceitLastMatches } from 'csdm/ui/downloads/faceit/last-matches';
import { LastMatches as RenownLastMatches } from 'csdm/ui/downloads/renown/last-matches';
import { BanStats } from 'csdm/ui/ban/stats/ban-stats';
import { MatchPlayers } from 'csdm/ui/match/players/match-players';
import { MatchPlayersLoader } from 'csdm/ui/match/players/match-players-loader';
import { Search } from 'csdm/ui/search/search';
import { InitialRouteRedirector } from 'csdm/ui/bootstrap/initial-route-redirector';
import { RoutePath } from 'csdm/ui/routes-paths';
import { PlayerRank } from './player/rank/player-rank';
import { ErrorBoundary } from './error-boundary';
import { OpeningDuelsMapLoader } from 'csdm/ui/match/duels/opening-duels-map/opening-duels-map-loader';
import { MatchDuels } from 'csdm/ui/match/duels/match-duels';
import { OpeningDuelsStats } from 'csdm/ui/match/duels/opening-duels-stats/opening-duels-stats';
import { PlayersDuelsMatrix } from 'csdm/ui/match/duels/players-duels-matrix';
import { Teams } from 'csdm/ui/teams/teams';
import { Team } from 'csdm/ui/team/team';
import { TeamOverview } from 'csdm/ui/team/overview/team-overview';
import { TeamMatchesTable } from './team/matches/team-matches-table';
import { TeamMaps } from './team/maps/team-maps';
import { TeamHeatmap } from './team/heatmap/team-heatmap';
import { Videos } from './videos/videos';
import { FiveEPlayLastMatches } from './downloads/five-eplay/5eplay-last-matches';
import { TeamPerformance } from './team/performance/team-performance';
import { PlayerHeatmap } from './player/heatmap/player-heatmap';
export const router = createHashRouter(createRoutesFromElements(React.createElement(Route, { path: "/", element: React.createElement(Root, null), errorElement: React.createElement(ErrorBoundary, null) },
    React.createElement(Route, { path: RoutePath.PinnerPlayer, element: React.createElement(PinnedPlayer, null) }),
    React.createElement(Route, { path: RoutePath.Matches, element: React.createElement(Matches, null) }),
    React.createElement(Route, { path: `${RoutePath.Matches}/:checksum`, element: React.createElement(MatchLoader, null) },
        React.createElement(Route, { index: true, element: React.createElement(MatchOverview, null) }),
        React.createElement(Route, { path: RoutePath.MatchRounds },
            React.createElement(Route, { index: true, element: React.createElement(Rounds, null) }),
            React.createElement(Route, { path: ":number", element: React.createElement(Round, null) })),
        React.createElement(Route, { path: RoutePath.MatchPlayers },
            React.createElement(Route, { index: true, element: React.createElement(MatchPlayersLoader, null) }),
            React.createElement(Route, { path: ":steamId", element: React.createElement(MatchPlayers, null) })),
        React.createElement(Route, { path: RoutePath.MatchHeatmap, element: React.createElement(MatchHeatmap, null) }),
        React.createElement(Route, { path: RoutePath.MatchDuels, element: React.createElement(MatchDuels, null) },
            React.createElement(Route, { index: true, element: React.createElement(PlayersDuelsMatrix, null) }),
            React.createElement(Route, { path: RoutePath.MatchOpeningDuelsStats, element: React.createElement(OpeningDuelsStats, null) }),
            React.createElement(Route, { path: RoutePath.MatchOpeningDuelsMap, element: React.createElement(OpeningDuelsMapLoader, null) })),
        React.createElement(Route, { path: RoutePath.MatchWeapons, element: React.createElement(Weapons, null) }),
        React.createElement(Route, { path: RoutePath.MatchGrenades, element: React.createElement(MatchGrenades, null) },
            React.createElement(Route, { index: true, element: React.createElement(GrenadesStats, null) }),
            React.createElement(Route, { path: RoutePath.MatchGrenadesFinder, element: React.createElement(GrenadesFinderLoader, null) })),
        React.createElement(Route, { path: RoutePath.Match2dViewer },
            React.createElement(Route, { index: true, element: React.createElement(Viewer2DLoader, null) }),
            React.createElement(Route, { path: ":number", element: React.createElement(Viewer2DLoader, null) })),
        React.createElement(Route, { path: RoutePath.MatchVideo, element: React.createElement(VideoLoader, null) }),
        React.createElement(Route, { path: RoutePath.MatchChat, element: React.createElement(ChatMessages, null) }),
        React.createElement(Route, { path: RoutePath.MatchEconomy, element: React.createElement(Economy, null) })),
    React.createElement(Route, { path: RoutePath.Demos, element: React.createElement(Demos, null) }),
    React.createElement(Route, { path: `${RoutePath.Demos}/:path`, element: React.createElement(DemoLoader, null) }),
    React.createElement(Route, { path: RoutePath.Players, element: React.createElement(Players, null) }),
    React.createElement(Route, { path: `${RoutePath.Players}/:steamId`, element: React.createElement(Player, null) },
        React.createElement(Route, { index: true, element: React.createElement(PlayerOverview, null) }),
        React.createElement(Route, { path: RoutePath.PlayerCharts, element: React.createElement(PlayerCharts, null) }),
        React.createElement(Route, { path: RoutePath.PlayerMaps, element: React.createElement(PlayerMaps, null) }),
        React.createElement(Route, { path: RoutePath.PlayerHeatmap, element: React.createElement(PlayerHeatmap, null) }),
        React.createElement(Route, { path: RoutePath.PlayerRank, element: React.createElement(PlayerRank, null) }),
        React.createElement(Route, { path: RoutePath.PlayerMatches, element: React.createElement(PlayerMatchesTable, null) })),
    React.createElement(Route, { path: RoutePath.Teams, element: React.createElement(Teams, null) }),
    React.createElement(Route, { path: `${RoutePath.Teams}/:name`, element: React.createElement(Team, null) },
        React.createElement(Route, { index: true, element: React.createElement(TeamOverview, null) }),
        React.createElement(Route, { path: RoutePath.TeamMaps, element: React.createElement(TeamMaps, null) }),
        React.createElement(Route, { path: RoutePath.TeamHeatmap, element: React.createElement(TeamHeatmap, null) }),
        React.createElement(Route, { path: RoutePath.TeamPerformance, element: React.createElement(TeamPerformance, null) }),
        React.createElement(Route, { path: RoutePath.TeamMatches, element: React.createElement(TeamMatchesTable, null) })),
    React.createElement(Route, { path: RoutePath.Search, element: React.createElement(Search, null) }),
    React.createElement(Route, { path: RoutePath.Ban, element: React.createElement(BanStats, null) }),
    React.createElement(Route, { path: RoutePath.Analyses, element: React.createElement(Analyses, null) }),
    React.createElement(Route, { path: RoutePath.Downloads, element: React.createElement(Downloads, null) },
        React.createElement(Route, { index: true, element: React.createElement(ValveLastMatchesLoader, null) }),
        React.createElement(Route, { path: RoutePath.DownloadsFaceit, element: React.createElement(FaceitLastMatches, null) }),
        React.createElement(Route, { path: RoutePath.DownloadsRenown, element: React.createElement(RenownLastMatches, null) }),
        React.createElement(Route, { path: RoutePath.Downloads5EPlay, element: React.createElement(FiveEPlayLastMatches, null) }),
        React.createElement(Route, { path: RoutePath.DownloadsPending, element: React.createElement(PendingDownloads, null) })),
    React.createElement(Route, { path: RoutePath.Videos, element: React.createElement(Videos, null) }),
    React.createElement(Route, { index: true, element: React.createElement(InitialRouteRedirector, null) }))));
//# sourceMappingURL=router.js.map