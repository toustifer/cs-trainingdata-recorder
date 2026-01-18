import { getPngInformation } from './get-png-information';
import { getJpgInformation } from './get-jpg-information';
export async function getImageInformation(filePath) {
    const lowerCasePath = filePath.toLowerCase();
    if (lowerCasePath.endsWith('.png')) {
        return getPngInformation(filePath);
    }
    if (lowerCasePath.endsWith('.jpg') || lowerCasePath.endsWith('.jpeg')) {
        return getJpgInformation(filePath);
    }
    throw new Error('Unsupported image format. Only PNG and JPG are supported');
}
//# sourceMappingURL=get-image-information.js.map