// We don't use only the SteamID because it's not unique with BOTs (always 0).
export function buildPlayerId(playerSteamId, playerName) {
    return `${playerSteamId}-${playerName}`;
}
//# sourceMappingURL=build-player-id.js.map