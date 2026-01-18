import { isMac } from 'csdm/node/os/is-mac';
import { isWindows } from 'csdm/node/os/is-windows';
function findWindowsVersionFromGitHubRelease(release) {
    let versionsFound = [];
    for (const asset of release.assets) {
        const matches = /ffmpeg-n.*-latest-win64-gpl-(\d+\.\d+(\.\d+)?)\.zip/g.exec(asset.name);
        if (matches !== null) {
            versionsFound = [...versionsFound, matches[1]];
        }
    }
    if (versionsFound.length === 0) {
        throw new Error('FFMpeg version not found');
    }
    return versionsFound.sort().reverse()[0];
}
export async function fetchLastFfmpegVersion() {
    let version;
    if (isWindows) {
        // Possible host alternative https://www.gyan.dev/ffmpeg/builds/ but it's slower than GitHub
        const response = await fetch('https://api.github.com/repos/BtbN/FFmpeg-Builds/releases/latest');
        const release = await response.json();
        version = findWindowsVersionFromGitHubRelease(release);
    }
    else if (isMac) {
        const response = await fetch('https://evermeet.cx/ffmpeg/info/ffmpeg/release');
        const data = await response.json();
        version = data.version;
    }
    else {
        const response = await fetch('https://johnvansickle.com/ffmpeg/release-readme.txt');
        const text = await response.text();
        const results = /version: (.*)/.exec(text);
        if (results === null || results.length !== 2) {
            throw new Error('FFMpeg version not found');
        }
        version = results[1];
    }
    return version;
}
//# sourceMappingURL=fetch-last-ffmpeg-version.js.map