import React, { useRef, useEffect } from 'react';
import { Trans } from '@lingui/react/macro';
import { useHeatmapContext } from './heatmap-context';
import { HeatmapRenderer } from 'csdm/ui/shared/heatmap-renderer';
import { getScaledCoordinateX } from 'csdm/ui/maps/get-scaled-coordinate-x';
import { getScaledCoordinateY } from 'csdm/ui/maps/get-scaled-coordinate-y';
import { useMaps } from 'csdm/ui/maps/use-maps';
import { UnsupportedMap } from 'csdm/ui/components/unsupported-map';
import { Message } from 'csdm/ui/components/message';
import { useMapCanvas } from 'csdm/ui/hooks/use-map-canvas';
import { RadarLevel } from 'csdm/ui/maps/radar-level';
import { ResetHeatmapZoom } from './heatmap-events';
function HeatmapCanvas({ map, game, points, alpha, blur, radius, radarLevel }) {
    const heatmapCanvasRef = useRef(null);
    const heatmapRendererRef = useRef(null);
    const { setCanvas, interactiveCanvas } = useMapCanvas({
        map,
        game,
        mode: radarLevel === RadarLevel.Upper ? 'upper' : 'lower',
        draw: (interactiveCanvas, context) => {
            const heatmapCanvas = heatmapCanvasRef.current;
            if (!heatmapCanvas) {
                return;
            }
            if (!heatmapRendererRef.current) {
                heatmapCanvas.width = interactiveCanvas.canvasSize.width;
                heatmapCanvas.height = interactiveCanvas.canvasSize.height;
                heatmapRendererRef.current = new HeatmapRenderer(heatmapCanvas);
            }
            const scaledPoints = points.map((point) => {
                const x = interactiveCanvas.zoomedX(getScaledCoordinateX(map, map.radarSize, point.x));
                const y = interactiveCanvas.zoomedY(getScaledCoordinateY(map, map.radarSize, point.y));
                return [x, y, 1];
            });
            const heatmapRenderer = heatmapRendererRef.current;
            heatmapRenderer.setAlpha(alpha);
            heatmapRenderer.setRadius(interactiveCanvas.zoomedSize(radius), blur);
            heatmapRenderer.setPoints(scaledPoints);
            heatmapRenderer.draw();
            // draw the heatmap over the radar
            context.drawImage(heatmapCanvas, 0, 0);
        },
    });
    const { setWrapper, canvasSize, resetZoom } = interactiveCanvas;
    useEffect(() => {
        window.addEventListener(ResetHeatmapZoom.name, resetZoom);
        return () => {
            window.removeEventListener(ResetHeatmapZoom.name, resetZoom);
        };
    }, [resetZoom]);
    return (React.createElement("div", { ref: setWrapper, className: "relative flex size-full" },
        React.createElement("canvas", { id: "radar-canvas", ref: (el) => setCanvas(el), width: canvasSize.width, height: canvasSize.height }),
        React.createElement("canvas", { id: "heatmap-canvas", ref: heatmapCanvasRef, className: "hidden" })));
}
export function Heatmap() {
    const { alpha, blur, radius, points, mapName, game, radarLevel } = useHeatmapContext();
    const maps = useMaps();
    const map = maps.find((map) => map.name === mapName);
    if (mapName === '') {
        return React.createElement(Message, { message: React.createElement(Trans, null, "Select a map.") });
    }
    if (!map) {
        return React.createElement(UnsupportedMap, null);
    }
    if (points.length === 0) {
        return React.createElement(Message, { message: React.createElement(Trans, null, "No data points were found for the current filters.") });
    }
    return (React.createElement(HeatmapCanvas, { map: map, game: game, points: points, alpha: alpha, blur: blur, radius: radius, radarLevel: radarLevel }));
}
//# sourceMappingURL=heatmap.js.map