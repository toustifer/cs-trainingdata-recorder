import path from 'node:path';
import {} from 'csdm/common/types/counter-strike';
import { getImagesFolderPath } from 'csdm/node/filesystem/get-images-folder-path';
export function getRankImageSrc(rank) {
    const imagesFolderPath = getImagesFolderPath();
    const imageSrc = path.join(imagesFolderPath, 'ranks', 'competitive', `${rank}.png`);
    return `file://${imageSrc}`;
}
//# sourceMappingURL=get-rank-image-src.js.map