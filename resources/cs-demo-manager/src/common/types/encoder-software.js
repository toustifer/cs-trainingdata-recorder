export const EncoderSoftware = {
    VirtualDub: 'VirtualDub',
    FFmpeg: 'FFmpeg',
};
export function isValidEncoderSoftware(value) {
    return Object.values(EncoderSoftware).includes(value);
}
//# sourceMappingURL=encoder-software.js.map