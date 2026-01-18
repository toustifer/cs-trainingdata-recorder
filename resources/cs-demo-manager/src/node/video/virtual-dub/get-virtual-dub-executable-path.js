import path from 'node:path';
import { getVirtualDubFolderPath } from './get-virtual-dub-folder-path';
export function getVirtualDubExecutablePath() {
    const installationPath = getVirtualDubFolderPath();
    const executableName = process.arch === 'x64' ? 'Veedub64' : 'VirtualDub';
    return path.join(installationPath, `${executableName}.exe`);
}
//# sourceMappingURL=get-virtual-dub-executable-path.js.map