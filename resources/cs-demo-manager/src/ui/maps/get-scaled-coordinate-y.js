export function getScaledCoordinateY(map, imageSize, yFromDemo) {
    const yForDefaultRadarHeight = (map.posY - yFromDemo) / map.scale;
    const scaledY = (yForDefaultRadarHeight * imageSize) / map.radarSize;
    return scaledY;
}
//# sourceMappingURL=get-scaled-coordinate-y.js.map