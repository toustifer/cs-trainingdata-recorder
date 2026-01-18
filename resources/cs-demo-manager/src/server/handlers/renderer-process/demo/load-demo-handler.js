import { loadDemoByPath } from 'csdm/node/demo/load-demo-by-path';
import { handleError } from '../../handle-error';
export async function loadDemoHandler(demoPath) {
    try {
        const demo = await loadDemoByPath(demoPath);
        return demo;
    }
    catch (error) {
        handleError(error, `Error while loading demo ${demoPath}`);
    }
}
//# sourceMappingURL=load-demo-handler.js.map