import fs from 'fs-extra';
import { getCamerasPreviewsFolderPath } from './get-cameras-previews-folder-path';
export async function ensureCamerasPreviewsFolderExist() {
    await fs.ensureDir(getCamerasPreviewsFolderPath());
}
//# sourceMappingURL=ensure-cameras-previews-folders-exist.js.map