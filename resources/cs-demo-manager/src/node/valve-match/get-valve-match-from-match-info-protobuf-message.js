import { encodeMatch } from 'csgo-sharecode';
import { CDataGCCStrike15_v2_MatchInfoSchema, toBinary, } from 'csgo-protobuf';
import { Game, TeamNumber } from 'csdm/common/types/counter-strike';
import { ValveMatchResult } from 'csdm/common/types/valve-match';
import { getMapName } from './get-map-name';
import { DownloadStatus } from 'csdm/common/types/download-status';
import { unixTimestampToDate } from 'csdm/common/date/unix-timestamp-to-date';
import { lastArrayItem } from 'csdm/common/array/last-array-item';
function sumNumberArray(numberArray) {
    return numberArray.reduce((previous, current) => {
        return previous + current;
    }, 0);
}
function steamId3ToSteamId64(steamId3) {
    return (BigInt(0x01_10_00_01_00_00_00_00) + BigInt(steamId3)).toString();
}
export function getLastRoundStatsMessage(matchInfoMessage) {
    const { roundstatsLegacy, roundstatsall } = matchInfoMessage;
    return roundstatsLegacy ?? lastArrayItem(roundstatsall);
}
function getMatchResult(lastRoundMsg) {
    const matchResult = lastRoundMsg.matchResult;
    if (matchResult === undefined || matchResult === 0) {
        return ValveMatchResult.Tied;
    }
    if (matchResult === 1) {
        return lastRoundMsg.bSwitchedTeams ? ValveMatchResult.CTWon : ValveMatchResult.TWon;
    }
    return lastRoundMsg.bSwitchedTeams ? ValveMatchResult.TWon : ValveMatchResult.CTWon;
}
export function buildMatchName(lastRoundReservationId, tvPort, serverIp) {
    return `match730_${lastRoundReservationId.toString().padStart(21, '0')}_${tvPort
        .toString()
        .padStart(10, '0')}_${serverIp}`;
}
function getTeamNames(tournamentTeams) {
    let teamNameStartedCT = 'Team CT';
    let teamNameStartedT = 'Team T';
    if (tournamentTeams.length >= 2) {
        teamNameStartedCT = tournamentTeams[0].teamName;
        teamNameStartedT = tournamentTeams[1].teamName;
    }
    return { teamNameStartedCT, teamNameStartedT };
}
function getPlayerStartedTeamNumber(accountIds, steamId3, switchedTeams = false) {
    // Index 0 to 4 => players that started as CT
    // Index 5 to 9 => players that started as T
    const playerIndexLastRound = accountIds.indexOf(steamId3);
    if (playerIndexLastRound < 5) {
        return switchedTeams ? TeamNumber.T : TeamNumber.CT;
    }
    return switchedTeams ? TeamNumber.CT : TeamNumber.T;
}
function getPlayerTeamNumberForRound(player, roundNumber, maxRounds) {
    if (roundNumber <= maxRounds / 2) {
        return player.startMatchTeamNumber;
    }
    if (roundNumber <= maxRounds) {
        return player.startMatchTeamNumber === TeamNumber.CT ? TeamNumber.T : TeamNumber.CT;
    }
    // Handle overtimes available with official tournament events, it assumes it's an MR3 overtimes.
    const previousTeamNumber = player.rounds[roundNumber - 2].teamNumber;
    const overtimeRoundNumber = roundNumber - maxRounds;
    const isBeginningOfOvertime = overtimeRoundNumber % 3 === 1;
    if (isBeginningOfOvertime) {
        return previousTeamNumber === TeamNumber.CT ? TeamNumber.T : TeamNumber.CT;
    }
    return previousTeamNumber;
}
export function getValveMatchFromMatchInfoProtobufMesssage(matchInfoMessage) {
    const lastRoundMessage = getLastRoundStatsMessage(matchInfoMessage);
    const { roundstatsall, matchid, matchtime } = matchInfoMessage;
    const lastRoundReservation = lastRoundMessage.reservation;
    const players = [];
    let currentScoreTeamThatStartedCt = 0;
    let currentScoreTeamThatStartedT = 0;
    // maxRounds is always present in CS2 messages but not necessarily in CS:GO messages.
    // Fallback to the CS:GO 30 max rounds rule by default.
    const maxRounds = lastRoundMessage.maxRounds > 0 ? lastRoundMessage.maxRounds : 30;
    if (roundstatsall.length > 0) {
        roundstatsall.map((roundMessage, roundIndex) => {
            const roundNumber = roundIndex + 1;
            let [scoreTeamStartedCt, scoreTeamStartedT] = roundMessage.teamScores;
            if (roundMessage.bSwitchedTeams) {
                [scoreTeamStartedCt, scoreTeamStartedT] = [scoreTeamStartedT, scoreTeamStartedCt];
            }
            const { accountIds } = roundMessage.reservation;
            for (const [playerIndex, steamId3] of accountIds.entries()) {
                const steamId64 = steamId3ToSteamId64(steamId3);
                let player = players.find((player) => player.steamId === steamId64);
                if (player === undefined) {
                    const startMatchTeamNumber = getPlayerStartedTeamNumber(lastRoundReservation.accountIds, steamId3, lastRoundMessage.bSwitchedTeams);
                    player = {
                        steamId: steamId64,
                        name: `Player ${playerIndex + 1}`,
                        avatar: '',
                        killCount: 0,
                        assistCount: 0,
                        deathCount: 0,
                        headshotCount: 0,
                        mvp: 0,
                        score: 0,
                        startMatchTeamNumber,
                        rounds: [],
                    };
                    players.push(player);
                }
                const hasPlayerWonRound = (player) => {
                    if (player.startMatchTeamNumber === TeamNumber.CT) {
                        return currentScoreTeamThatStartedCt !== scoreTeamStartedCt;
                    }
                    return currentScoreTeamThatStartedT !== scoreTeamStartedT;
                };
                const { kills, deaths, assists, enemyHeadshots, mvps, scores } = roundMessage;
                const round = {
                    number: roundNumber,
                    killCount: Math.max(0, kills[playerIndex] - player.killCount), // If the player killed himself, the sub may be -1
                    deathCount: deaths[playerIndex] - player.deathCount,
                    assistCount: assists[playerIndex] - player.assistCount,
                    headshotCount: enemyHeadshots[playerIndex] - player.headshotCount,
                    mvpCount: mvps[playerIndex] - player.mvp,
                    hasWon: hasPlayerWonRound(player),
                    teamNumber: getPlayerTeamNumberForRound(player, roundNumber, maxRounds),
                };
                player.rounds.push(round);
                player.killCount = kills[playerIndex];
                player.deathCount = deaths[playerIndex];
                player.assistCount = assists[playerIndex];
                player.score = scores[playerIndex];
                player.mvp = mvps[playerIndex];
                player.headshotCount = enemyHeadshots.length > playerIndex ? enemyHeadshots[playerIndex] : player.headshotCount;
            }
            currentScoreTeamThatStartedCt = scoreTeamStartedCt;
            currentScoreTeamThatStartedT = scoreTeamStartedT;
        });
    }
    else {
        // Old definitions, it doesn't contains rounds data
        const [scoreTeamStartedCt, scoreTeamStartedT] = lastRoundMessage.teamScores;
        currentScoreTeamThatStartedCt = scoreTeamStartedCt;
        currentScoreTeamThatStartedT = scoreTeamStartedT;
        const { accountIds } = lastRoundReservation;
        for (const [playerIndex, steamId3] of accountIds.entries()) {
            const startMatchTeamNumber = getPlayerStartedTeamNumber(accountIds, steamId3);
            const steamId64 = steamId3ToSteamId64(steamId3);
            const player = {
                steamId: steamId64,
                name: `Player ${playerIndex + 1}`,
                avatar: '',
                killCount: lastRoundMessage.kills[playerIndex],
                assistCount: lastRoundMessage.assists[playerIndex],
                deathCount: lastRoundMessage.deaths[playerIndex],
                headshotCount: lastRoundMessage.enemyHeadshots[playerIndex] || 0,
                mvp: lastRoundMessage.mvps[playerIndex],
                score: lastRoundMessage.scores[playerIndex],
                startMatchTeamNumber,
                rounds: [],
            };
            players.push(player);
        }
    }
    const matchId = matchid;
    const dateTimestamp = matchtime;
    const durationInSeconds = lastRoundMessage.matchDuration;
    const gameType = lastRoundReservation.gameType;
    const watchablematchinfo = matchInfoMessage.watchablematchinfo;
    const tvPort = watchablematchinfo.tvPort;
    const serverIp = watchablematchinfo.serverIp;
    const lastRoundReservationId = lastRoundMessage.reservationid;
    const demoUrl = lastRoundMessage.map;
    const demoName = buildMatchName(lastRoundReservationId, tvPort, serverIp);
    const sharecode = encodeMatch({
        matchId: BigInt(matchId),
        reservationId: BigInt(lastRoundReservationId),
        tvPort,
    });
    const result = getMatchResult(lastRoundMessage);
    const { teamNameStartedCT, teamNameStartedT } = getTeamNames(lastRoundReservation.tournamentTeams);
    const date = unixTimestampToDate(dateTimestamp);
    // Didn't find a better way to detect the correct game :/
    // There is also maxRounds which is absent in old CSGO proto def or its value may be 16 (short match) or 30 (long match).
    // But this is probably not a good idea for the future.
    const publicCs2ReleaseDate = new Date('2023-09-27');
    const game = date >= publicCs2ReleaseDate ? Game.CS2 : Game.CSGO;
    const match = {
        id: matchId.toString(),
        game,
        date: date.toISOString(),
        durationInSeconds,
        result,
        scoreTeamStartedCT: currentScoreTeamThatStartedCt,
        scoreTeamStartedT: currentScoreTeamThatStartedT,
        killCount: sumNumberArray(lastRoundMessage.kills),
        assistCount: sumNumberArray(lastRoundMessage.assists),
        deathCount: sumNumberArray(lastRoundMessage.deaths),
        demoUrl,
        mapName: getMapName(gameType),
        sharecode,
        name: demoName,
        players,
        teamNameStartedT,
        teamNameStartedCT,
        downloadStatus: DownloadStatus.NotDownloaded,
        protobufBytes: toBinary(CDataGCCStrike15_v2_MatchInfoSchema, matchInfoMessage),
    };
    return match;
}
//# sourceMappingURL=get-valve-match-from-match-info-protobuf-message.js.map