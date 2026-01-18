import { crc64 } from 'crc64-ecma';
// ! Demos checksums are based on .dem file headers because it would be slower to read the whole file.
export function getDemoChecksumFromFileStats(header, stats) {
    let data;
    if (header.filestamp === 'HL2DEMO') {
        const { serverName, clientName, mapName, networkProtocol, playbackFrames, playbackTicks, signonLength } = header;
        data = `${mapName}${serverName}${clientName}${playbackFrames}${playbackTicks}${networkProtocol}${signonLength}${stats.size}`;
    }
    else {
        const { buildNumber, clientName, demoVersionGuid, demoVersionName, mapName, networkProtocol, serverName } = header;
        data = `${mapName}${serverName}${clientName}${networkProtocol}${buildNumber}${demoVersionGuid}${demoVersionName}${stats.size}`;
    }
    const checksum = crc64(data).toString(16);
    return checksum;
}
//# sourceMappingURL=get-demo-checksum-from-file-stats.js.map