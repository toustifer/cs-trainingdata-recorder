import { server } from 'csdm/server/server';
export async function isCs2ConnectedToServerHandler() {
    return Promise.resolve(server.isGameConnected());
}
//# sourceMappingURL=is-cs2-connected-to-server-handler.js.map