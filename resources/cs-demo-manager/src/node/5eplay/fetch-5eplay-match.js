import { FiveEPlayResourceNotFound } from './errors/5eplay-resource-not-found';
import { unixTimestampToDate } from 'csdm/common/date/unix-timestamp-to-date';
import { Game } from 'csdm/common/types/counter-strike';
import { getDownloadStatus } from 'csdm/node/download/get-download-status';
import { roundNumber } from 'csdm/common/math/round-number';
export async function fetch5EPlayMatch(matchId, downloadFolderPath) {
    const response = await fetch(`https://gate.5eplay.com/crane/http/api/data/match/${matchId}`);
    const data = await response.json();
    if (data.data === null) {
        throw new FiveEPlayResourceNotFound();
    }
    const { main: match, group_1: team1, group_2: team2 } = data.data;
    return {
        id: matchId,
        downloadStatus: await getDownloadStatus(downloadFolderPath, matchId, match.demo_url),
        date: unixTimestampToDate(match.start_time).toISOString(),
        demoUrl: match.demo_url,
        durationInSeconds: match.end_time - match.start_time,
        game: match.cs_type === 0 ? Game.CS2 : Game.CSGO,
        mapName: match.map,
        url: `https://arena.5eplay.com/data/match/${matchId}`,
        teams: [
            {
                name: 'Team 1',
                score: match.group1_all_score,
                firstHalfScore: match.group1_fh_score,
                secondHalfScore: match.group1_sh_score,
                playerIds: match.group1_uids.split(',').map(Number),
            },
            {
                name: 'Team 2',
                score: match.group2_all_score,
                firstHalfScore: match.group2_fh_score,
                secondHalfScore: match.group2_sh_score,
                playerIds: match.group2_uids.split(',').map(Number),
            },
        ],
        players: [team1, team2].flatMap((group) => {
            return group.map((data) => {
                const player = data.fight;
                const user = data.user_info.user_data;
                return {
                    id: user.uuid,
                    uid: user.uid,
                    domainId: user.domain,
                    name: user.username,
                    avatarUrl: `https://oss-arena.5eplay.com/${data.user_info.user_data.profile.avatarUrl}`,
                    killCount: Number(player.kill),
                    assistCount: Number(player.assist),
                    deathCount: Number(player.death),
                    headshotCount: Number(player.headshot),
                    headshotPercentage: roundNumber(Number(player.per_headshot) * 100),
                    killDeathRatio: roundNumber(Number(player.kill) / Number(player.death), 1),
                    killPerRound: roundNumber(Number(player.kill) / Number(match.round_total), 1),
                    kast: Number(player.kast),
                    threeKillCount: Number(player.kill_3),
                    fourKillCount: Number(player.kill_4),
                    fiveKillCount: Number(player.kill_5),
                    hasWon: player.is_win === '1',
                    firstKillCount: Number(player.first_kill),
                    firstDeathCount: Number(player.first_death),
                    bombDefusedCount: Number(player.defused_bomb),
                    bombPlantedCount: Number(player.planted_bomb),
                    averageDamagePerRound: Number(player.adr),
                };
            });
        }),
    };
}
//# sourceMappingURL=fetch-5eplay-match.js.map