import { fetchDemoByChecksum } from 'csdm/node/database/demos/fetch-demo-by-checksum';
import { NetworkError } from 'csdm/node/errors/network-error';
import { updateValvePlayersFromSteam } from 'csdm/node/valve-match/update-valve-players-from-steam';
import { getDemoFromFilePath } from './get-demo-from-file-path';
export async function loadDemoByPath(demoPath) {
    let demo = await getDemoFromFilePath(demoPath);
    const demoInDatabase = await fetchDemoByChecksum(demo.checksum);
    if (demoInDatabase) {
        demo = {
            ...demo,
            ...demoInDatabase,
            filePath: demoPath,
        };
    }
    if (demo.valveMatch !== undefined) {
        try {
            await updateValvePlayersFromSteam(demo.valveMatch.players);
        }
        catch (error) {
            if (!(error instanceof NetworkError)) {
                throw error;
            }
        }
    }
    return demo;
}
//# sourceMappingURL=load-demo-by-path.js.map