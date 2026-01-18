import { useRef } from 'react';
import { GrenadeName } from 'csdm/common/types/counter-strike';
import { loadImageFromFilePath } from 'csdm/ui/shared/load-image-from-file-path';
async function getCachedImage(imageRef, imageName) {
    if (imageRef.current !== null) {
        return imageRef.current;
    }
    imageRef.current = await loadImageFromFilePath(`${window.csdm.IMAGES_FOLDER_PATH}/grenades/${imageName}`);
    return imageRef.current;
}
export function useGetGrenadeImage() {
    const smokeImage = useRef(null);
    const flashbangImage = useRef(null);
    const heImage = useRef(null);
    const decoyImage = useRef(null);
    const molotovImage = useRef(null);
    const unknownImage = useRef(null);
    return async (grenadeName) => {
        switch (grenadeName) {
            case GrenadeName.Smoke:
                return await getCachedImage(smokeImage, 'smoke-detonate.png');
            case GrenadeName.Flashbang:
                return await getCachedImage(flashbangImage, 'flashbang-detonate.png');
            case GrenadeName.HE:
                return await getCachedImage(heImage, 'he-detonate.png');
            case GrenadeName.Decoy:
                return await getCachedImage(decoyImage, 'decoy-detonate.png');
            case GrenadeName.Molotov:
            case GrenadeName.Incendiary:
                return await getCachedImage(molotovImage, 'molotov-detonate.png');
            default:
                return await getCachedImage(unknownImage, 'unknown-grenade.png');
        }
    };
}
//# sourceMappingURL=use-get-grenade-image.js.map