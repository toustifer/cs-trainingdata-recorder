export async function loadAudio(audioFilePath) {
    return new Promise((resolve, reject) => {
        const audio = new Audio();
        audio.addEventListener('error', (error) => {
            reject(error);
        });
        audio.addEventListener('loadedmetadata', () => {
            resolve(audio);
        });
        audio.src = `file://${audioFilePath.replaceAll('#', '%23')}`;
    });
}
//# sourceMappingURL=load-audio.js.map