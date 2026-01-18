export async function resizeImage(image, width) {
    const resizedImage = await createImageBitmap(image, {
        resizeWidth: width,
        resizeQuality: 'high',
    });
    const canvas = document.createElement('canvas');
    canvas.width = resizedImage.width;
    canvas.height = resizedImage.height;
    const ctx = canvas.getContext('2d');
    ctx.drawImage(resizedImage, 0, 0);
    const base64 = canvas.toDataURL();
    return base64;
}
export async function resizeImageFromFilePath(imagePath, width) {
    const buffer = await window.csdm.readImageFile(imagePath);
    const blob = new Blob([buffer]);
    return resizeImage(blob, width);
}
//# sourceMappingURL=resize-image.js.map