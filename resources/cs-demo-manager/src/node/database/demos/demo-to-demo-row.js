export function demoToDemoRow(demo) {
    return {
        checksum: demo.checksum,
        game: demo.game,
        source: demo.source,
        type: demo.type,
        name: demo.name,
        map_name: demo.mapName,
        date: new Date(demo.date),
        build_number: demo.buildNumber,
        network_protocol: demo.networkProtocol,
        server_name: demo.serverName,
        client_name: demo.clientName,
        tick_count: demo.tickCount,
        tickrate: demo.tickrate,
        framerate: demo.frameRate,
        duration: demo.duration,
        share_code: demo.shareCode,
    };
}
//# sourceMappingURL=demo-to-demo-row.js.map