import { db } from '../database';
export async function updateDemo(checksum, data) {
    await db
        .updateTable('demos')
        .set({
        tick_count: data.tickCount,
        tickrate: data.tickrate,
        framerate: data.frameRate,
        duration: data.duration,
        server_name: data.serverName,
        client_name: data.clientName,
    })
        .where('checksum', '=', checksum)
        .execute();
}
//# sourceMappingURL=update-demo.js.map