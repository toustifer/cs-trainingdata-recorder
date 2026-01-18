import { DownloadSource } from './download-types';
export function buildDownloadFromValveMatch(match) {
    return {
        source: DownloadSource.Valve,
        game: match.game,
        matchId: match.id,
        demoUrl: match.demoUrl,
        fileName: match.name,
        match: match,
    };
}
//# sourceMappingURL=build-download-from-valve-match.js.map