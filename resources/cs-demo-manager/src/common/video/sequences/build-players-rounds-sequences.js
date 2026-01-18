export function buildPlayersRoundsSequences({ match, steamIds, rounds, startSecondsBeforeEvent, endSecondsAfterEvent, settings, firstSequenceNumber, }) {
    const sequences = [];
    const startSecondsBeforeEventTick = startSecondsBeforeEvent;
    const endSecondsAfterEventTick = endSecondsAfterEvent;
    for (const steamId of steamIds) {
        for (const round of match.rounds) {
            if (rounds.length > 0 && !rounds.includes(round.number)) {
                continue;
            }
            const hasShot = match.shots.some((shot) => {
                return shot.roundNumber === round.number && shot.playerSteamId === steamId;
            });
            const playerDeath = match.kills.find((kill) => {
                return kill.roundNumber === round.number && kill.victimSteamId === steamId;
            });
            if (hasShot || playerDeath) {
                const endTick = playerDeath ? playerDeath.tick : round.endTick;
                const startTick = round.freezetimeEndTick - match.tickrate * startSecondsBeforeEventTick;
                sequences.push({
                    number: firstSequenceNumber + sequences.length,
                    startTick,
                    endTick: endTick + match.tickrate * endSecondsAfterEventTick,
                    showOnlyDeathNotices: settings.showOnlyDeathNotices,
                    deathNoticesDuration: settings.deathNoticesDuration,
                    showXRay: settings.showXRay,
                    showAssists: settings.showAssists,
                    recordAudio: settings.recordAudio,
                    playerVoicesEnabled: settings.playerVoicesEnabled,
                    playersOptions: [],
                    playerCameras: [
                        {
                            tick: startTick,
                            playerSteamId: steamId,
                            playerName: match.players.find((player) => player.steamId === steamId)?.name ?? '',
                        },
                    ],
                    cameras: [],
                    cfg: 'cl_draw_only_deathnotices 1',
                });
            }
        }
    }
    return sequences;
}
//# sourceMappingURL=build-players-rounds-sequences.js.map