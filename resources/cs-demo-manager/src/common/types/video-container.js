export const VideoContainer = {
    AVI: 'avi',
    MP4: 'mp4',
    MKV: 'mkv',
};
export function isValidVideoContainer(value) {
    return Object.values(VideoContainer).includes(value);
}
//# sourceMappingURL=video-container.js.map