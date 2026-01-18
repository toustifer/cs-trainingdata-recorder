export const RoutePath = {
    Demos: '/demos',
    Matches: '/matches',
    MatchHeatmap: 'heatmap',
    MatchRounds: 'rounds',
    MatchPlayers: 'players',
    MatchWeapons: 'weapons',
    MatchDuels: 'duels',
    MatchOpeningDuelsStats: 'opening-duels-stats',
    MatchOpeningDuelsMap: 'opening-duels-map',
    MatchGrenades: 'grenades',
    MatchGrenadesFinder: 'finder',
    Match2dViewer: 'viewer-2d',
    MatchVideo: 'video',
    MatchChat: 'chat',
    MatchEconomy: 'economy',
    Analyses: '/analyses',
    Players: '/players',
    PlayerCharts: 'charts',
    PlayerRank: 'rank',
    PlayerMatches: 'matches',
    PlayerMaps: 'maps',
    PlayerHeatmap: 'heatmap',
    PinnerPlayer: '/pinned-player',
    Search: '/search',
    Downloads: '/downloads',
    DownloadsFaceit: 'faceit',
    DownloadsRenown: 'renown',
    Downloads5EPlay: '5eplay',
    DownloadsPending: 'pending',
    Ban: '/ban',
    Teams: '/teams',
    TeamHeatmap: 'heatmap',
    TeamMatches: 'matches',
    TeamPerformance: 'performance',
    TeamMaps: 'maps',
    Videos: '/videos',
};
export function buildDemoPath(demoPath) {
    const sanitizedPath = encodeURIComponent(demoPath);
    return `${RoutePath.Demos}/${sanitizedPath}`;
}
export function buildMatchPath(checksum) {
    return `${RoutePath.Matches}/${checksum}`;
}
export function buildMatchRoundsPath(checksum) {
    return `${RoutePath.Matches}/${checksum}/${RoutePath.MatchRounds}`;
}
export function buildMatchPlayerPath(checksum, steamId) {
    return `${RoutePath.Matches}/${checksum}/${RoutePath.MatchPlayers}/${steamId}`;
}
export function buildMatchRoundPath(checksum, roundNumber) {
    return `${buildMatchRoundsPath(checksum)}/${roundNumber}`;
}
export function buildMatch2dViewerRoundPath(checksum, roundNumber) {
    return `${buildMatchPath(checksum)}/${RoutePath.Match2dViewer}/${roundNumber}`;
}
export function buildMatchVideoPath(checksum) {
    return `${buildMatchPath(checksum)}/${RoutePath.MatchVideo}`;
}
export function buildPlayerPath(playerSteamId) {
    return `${RoutePath.Players}/${playerSteamId}`;
}
export function buildPlayerMatchesPath(playerSteamId) {
    return `${buildPlayerPath(playerSteamId)}/${RoutePath.PlayerMatches}`;
}
export function buildPendingDownloadPath() {
    return `${RoutePath.Downloads}/${RoutePath.DownloadsPending}`;
}
export function buildTeamPath(name) {
    return `${RoutePath.Teams}/${name}`;
}
//# sourceMappingURL=routes-paths.js.map