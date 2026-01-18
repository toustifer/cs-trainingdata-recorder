export function hexToRgb(hex) {
    const r = Number.parseInt(hex.slice(1, 3), 16);
    const g = Number.parseInt(hex.slice(3, 5), 16);
    const b = Number.parseInt(hex.slice(5, 7), 16);
    return [r, g, b];
}
export function hexToRgba(hex, alpha) {
    const [r, g, b] = hexToRgb(hex);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
export function getColorAtPercentage(startColor, endColor, percentage) {
    const newRgb = [0, 0, 0];
    for (let index = 0; index < 3; index++) {
        newRgb[index] = Math.floor(startColor[index] + (endColor[index] - startColor[index]) * (percentage / 100));
    }
    return `rgb(${newRgb.join(',')})`;
}
//# sourceMappingURL=colors.js.map