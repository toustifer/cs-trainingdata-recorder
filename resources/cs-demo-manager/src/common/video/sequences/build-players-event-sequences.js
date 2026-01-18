import { PlayerSequenceEvent } from 'csdm/common/types/player-sequence-event';
import { Perspective } from 'csdm/common/types/perspective';
import { lastArrayItem } from 'csdm/common/array/last-array-item';
function buildPlayersOptions(players) {
    const options = players.map((player) => {
        return {
            highlightKill: false,
            playerName: player.name,
            showKill: true,
            steamId: player.steamId,
            isVoiceEnabled: true,
        };
    });
    return options;
}
function getSteamIdToFocus(kill, steamIdKey, event, perspective) {
    let cameraFocusSteamId = kill[steamIdKey];
    if (event === PlayerSequenceEvent.Kills && perspective === Perspective.Enemy && kill.victimSteamId) {
        cameraFocusSteamId = kill.victimSteamId;
    }
    else if (event === PlayerSequenceEvent.Deaths && perspective === Perspective.Enemy && kill.killerSteamId) {
        cameraFocusSteamId = kill.killerSteamId;
    }
    return cameraFocusSteamId;
}
export function buildPlayersEventSequences({ event, match, steamIds, rounds, perspective, weapons, settings, startSecondsBeforeEvent, endSecondsAfterEvent, firstSequenceNumber, }) {
    const steamIdKey = event === PlayerSequenceEvent.Kills ? 'killerSteamId' : 'victimSteamId';
    let playerEvents = match.kills.filter((kill) => {
        if (rounds.length > 0 && !rounds.includes(kill.roundNumber)) {
            return false;
        }
        return steamIds.includes(kill[steamIdKey]);
    });
    if (weapons.length > 0) {
        playerEvents = playerEvents.filter((kill) => {
            return weapons.includes(kill.weaponName);
        });
    }
    if (playerEvents.length === 0) {
        return [];
    }
    const minimumSecondsBetweenTwoEvents = 2;
    const maxSecondsBetweenEvents = 10;
    const playersOptions = buildPlayersOptions(match.players);
    const sequences = [];
    const ticksRequiredBetweenTwoSequences = Math.round(match.tickrate * minimumSecondsBetweenTwoEvents);
    const additionalTicksBeforeEvent = Math.round(match.tickrate * startSecondsBeforeEvent);
    const additionalTicksAfterEvent = Math.round(match.tickrate * endSecondsAfterEvent);
    const maxTicksBetweenEvents = Math.round(match.tickrate * maxSecondsBetweenEvents);
    for (const [index, kill] of playerEvents.entries()) {
        const steamIdToFocus = getSteamIdToFocus(kill, steamIdKey, event, perspective);
        const sequenceStartTick = Math.max(1, kill.tick - additionalTicksBeforeEvent);
        let sequenceEndTick = Math.min(match.tickCount, kill.tick + additionalTicksAfterEvent);
        const nextKill = index < playerEvents.length - 1 ? playerEvents[index + 1] : undefined;
        if (nextKill !== undefined) {
            const isNextKillTooClose = kill.tick + maxTicksBetweenEvents >= nextKill.tick;
            if (isNextKillTooClose) {
                sequenceEndTick = Math.min(match.tickCount, nextKill.tick + additionalTicksAfterEvent);
            }
        }
        const previousSequence = sequences.length > 0 ? lastArrayItem(sequences) : undefined;
        if (previousSequence !== undefined) {
            const areSequencesOverlapping = previousSequence.endTick + ticksRequiredBetweenTwoSequences >= sequenceStartTick;
            if (areSequencesOverlapping) {
                previousSequence.endTick = sequenceEndTick;
                // add camera focus at the midpoint between the previous and current kill events to the previous sequence
                const cameraFocusSteamId = getSteamIdToFocus(kill, steamIdKey, event, perspective);
                const previousKill = playerEvents[index - 1];
                const previousKillTick = previousKill.tick;
                const midpointTick = Math.round((previousKillTick + kill.tick) / 2);
                previousSequence.playerCameras.push({
                    tick: midpointTick,
                    playerSteamId: cameraFocusSteamId,
                    playerName: match.players.find((player) => player.steamId === cameraFocusSteamId)?.name ?? '',
                });
                continue;
            }
        }
        sequences.push({
            number: firstSequenceNumber + sequences.length,
            startTick: sequenceStartTick,
            endTick: sequenceEndTick,
            showOnlyDeathNotices: settings.showOnlyDeathNotices,
            deathNoticesDuration: settings.deathNoticesDuration,
            showXRay: settings.showXRay,
            showAssists: settings.showAssists,
            recordAudio: settings.recordAudio,
            playerVoicesEnabled: settings.playerVoicesEnabled,
            playersOptions,
            playerCameras: [
                {
                    tick: sequenceStartTick,
                    playerSteamId: steamIdToFocus,
                    playerName: match.players.find((player) => player.steamId === steamIdToFocus)?.name ?? '',
                },
            ],
            cameras: [],
            cfg: 'cl_draw_only_deathnotices 1',
        });
    }
    return sequences;
}
//# sourceMappingURL=build-players-event-sequences.js.map