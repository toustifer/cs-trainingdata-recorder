import { fetchTeamsEconomyStats } from '../team/fetch-teams-economy-stats';
export async function fetchMatchTeamsEconomyStats(checksum) {
    return await fetchTeamsEconomyStats({ matchChecksum: checksum });
}
//# sourceMappingURL=fetch-match-teams-economy-stats.js.map