import fs from 'fs-extra';
import { DemoNotFound } from './errors/demo-not-found';
export async function assertDemoExists(demoPath) {
    const fileExists = await fs.pathExists(demoPath);
    if (!fileExists) {
        throw new DemoNotFound();
    }
}
//# sourceMappingURL=assert-demo-exists.js.map