export const RecordingOutput = {
    Images: 'images',
    ImagesAndVideo: 'images-and-video',
    Video: 'video',
};
export function isValidRecordingOutput(value) {
    return Object.values(RecordingOutput).includes(value);
}
//# sourceMappingURL=recording-output.js.map