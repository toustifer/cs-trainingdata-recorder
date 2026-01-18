function drawGrenadeImage(context, drawing, zoomedSize) {
    const imageSize = zoomedSize(40);
    context.drawImage(drawing.image, drawing.imageX - imageSize / 2, drawing.imageY - imageSize / 2, imageSize, imageSize);
}
export function drawGrenadeDrawings(drawings, context, interactiveCanvas, hoveredIdRef) {
    const { zoomedSize, getMouseX, getMouseY } = interactiveCanvas;
    context.lineWidth = zoomedSize(2);
    const mouseX = getMouseX();
    const mouseY = getMouseY();
    const hoveredDrawing = drawings.find((drawing) => {
        return context.isPointInStroke(drawing.path, mouseX, mouseY);
    });
    if (hoveredDrawing) {
        hoveredIdRef.current = hoveredDrawing.id;
        context.strokeStyle = 'green';
        context.stroke(hoveredDrawing.path);
        drawGrenadeImage(context, hoveredDrawing, zoomedSize);
    }
    else {
        hoveredIdRef.current = undefined;
        context.strokeStyle = 'red';
        for (const drawing of drawings) {
            context.stroke(drawing.path);
            drawGrenadeImage(context, drawing, zoomedSize);
        }
    }
}
//# sourceMappingURL=draw-grenade-drawings.js.map