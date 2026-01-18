const key = '2d-audio-offset';
// The offset is stored in seconds, can be negative or positive
export function getDemoAudioOffset(checksum) {
    const offset = window.localStorage.getItem(`${key}-${checksum}`);
    return offset ? parseFloat(offset) : 0;
}
export function deleteDemoAudioOffset(checksum) {
    window.localStorage.removeItem(`${key}-${checksum}`);
}
export function persistDemoAudioOffset(checksum, offset) {
    window.localStorage.setItem(`${key}-${checksum}`, String(offset));
}
//# sourceMappingURL=audio-offset.js.map