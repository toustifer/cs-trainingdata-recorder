import path from 'node:path';
export function getMatchDemoPath(downloadFolderPath, match) {
    return `${downloadFolderPath}${path.sep}${match.name}.dem`;
}
//# sourceMappingURL=get-match-demo-path.js.map