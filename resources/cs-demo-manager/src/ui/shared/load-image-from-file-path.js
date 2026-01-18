export function loadImageFromFilePath(imagePath) {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.addEventListener('load', () => {
            resolve(image);
        });
        image.addEventListener('error', reject);
        const src = imagePath.startsWith('file://') ? imagePath : `file://${imagePath}`;
        image.src = `${src}?timestamp=${Date.now()}`;
    });
}
//# sourceMappingURL=load-image-from-file-path.js.map