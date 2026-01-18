export function getScaledCoordinateX(map, imageSize, xFromDemo) {
    const xForDefaultRadarWidth = (xFromDemo - map.posX) / map.scale;
    const scaledX = (xForDefaultRadarWidth * imageSize) / map.radarSize;
    return scaledX;
}
//# sourceMappingURL=get-scaled-coordinate-x.js.map