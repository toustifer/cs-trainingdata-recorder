import os from 'node:os';
export function getAppInformation() {
    return {
        platform: process.platform,
        arch: process.arch,
        osVersion: os.release(),
        electronVersion: process.versions.electron,
        chromeVersion: process.versions.chrome,
    };
}
//# sourceMappingURL=get-app-information.js.map