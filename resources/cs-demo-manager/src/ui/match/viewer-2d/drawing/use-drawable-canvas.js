import { useEffect, useRef } from 'react';
export function useDrawableCanvas({ canvas, interactiveCanvas, isDrawingMode, tool }) {
    const isDrawing = useRef(false);
    const strokes = useRef([]);
    const redoStack = useRef([]);
    const currentStroke = useRef(null);
    const undo = () => {
        if (strokes.current.length === 0) {
            return;
        }
        const lastStroke = strokes.current.pop();
        if (lastStroke) {
            redoStack.current.push(lastStroke);
        }
    };
    const redo = () => {
        if (redoStack.current.length === 0) {
            return;
        }
        const lastStroke = redoStack.current.pop();
        if (lastStroke) {
            strokes.current.push(lastStroke);
        }
    };
    const clear = () => {
        strokes.current = [];
        redoStack.current = [];
        currentStroke.current = null;
    };
    useEffect(() => {
        if (!canvas || !isDrawingMode) {
            return;
        }
        const screenToWorld = (screenX, screenY) => {
            if (!canvas) {
                return { worldX: 0, worldY: 0 };
            }
            const rect = canvas.getBoundingClientRect();
            const canvasX = screenX - rect.left;
            const canvasY = screenY - rect.top;
            const worldX = interactiveCanvas.pixelToWorldX(canvasX);
            const worldY = interactiveCanvas.pixelToWorldY(canvasY);
            return { worldX, worldY };
        };
        const handleMouseDown = (event) => {
            event.preventDefault();
            event.stopPropagation();
            isDrawing.current = true;
            const { worldX, worldY } = screenToWorld(event.clientX, event.clientY);
            currentStroke.current = {
                tool: tool.type,
                color: tool.color,
                size: tool.size,
                points: [{ x: worldX, y: worldY }],
            };
            redoStack.current = [];
        };
        const handleMouseMove = (event) => {
            if (!isDrawing.current || !currentStroke.current) {
                return;
            }
            event.preventDefault();
            event.stopPropagation();
            const { worldX, worldY } = screenToWorld(event.clientX, event.clientY);
            currentStroke.current.points.push({ x: worldX, y: worldY });
        };
        const endDrawing = () => {
            if (!isDrawing.current || !currentStroke.current) {
                return;
            }
            isDrawing.current = false;
            strokes.current.push(currentStroke.current);
            currentStroke.current = null;
        };
        canvas.addEventListener('mousedown', handleMouseDown, { capture: true });
        canvas.addEventListener('mousemove', handleMouseMove, { capture: true });
        canvas.addEventListener('mouseup', endDrawing, { capture: true });
        canvas.addEventListener('mouseleave', endDrawing, { capture: true });
        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown, { capture: true });
            canvas.removeEventListener('mousemove', handleMouseMove, { capture: true });
            canvas.removeEventListener('mouseup', endDrawing, { capture: true });
            canvas.removeEventListener('mouseleave', endDrawing, { capture: true });
        };
    });
    const drawStrokes = (context) => {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        const drawStroke = (stroke) => {
            if (stroke.points.length < 1) {
                return;
            }
            context.save();
            context.beginPath();
            context.lineJoin = 'round';
            context.lineCap = 'round';
            context.lineWidth = interactiveCanvas.zoomedSize(stroke.size);
            if (stroke.tool === 'pen') {
                context.globalCompositeOperation = 'source-over';
                context.strokeStyle = stroke.color;
            }
            else {
                context.globalCompositeOperation = 'destination-out';
                context.strokeStyle = 'rgba(0,0,0,1)';
            }
            const [firstPoint] = stroke.points;
            context.moveTo(interactiveCanvas.zoomedX(firstPoint.x), interactiveCanvas.zoomedY(firstPoint.y));
            for (let i = 1; i < stroke.points.length; i++) {
                const point = stroke.points[i];
                context.lineTo(interactiveCanvas.zoomedX(point.x), interactiveCanvas.zoomedY(point.y));
            }
            context.stroke();
            context.closePath();
            context.restore();
        };
        for (const stroke of strokes.current) {
            drawStroke(stroke);
        }
        if (currentStroke.current) {
            drawStroke(currentStroke.current);
        }
    };
    return {
        drawStrokes,
        undo,
        redo,
        clear,
    };
}
//# sourceMappingURL=use-drawable-canvas.js.map