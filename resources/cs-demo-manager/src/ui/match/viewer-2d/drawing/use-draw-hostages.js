import { HostageState } from 'csdm/common/types/counter-strike';
import { useViewerContext } from '../use-viewer-context';
export function useDrawHostages() {
    const { hostagePositions, currentTick } = useViewerContext();
    const drawHostages = (context, { zoomedSize, zoomedToRadarX, zoomedToRadarY }) => {
        const positions = hostagePositions.filter((position) => position.tick === currentTick);
        for (const position of positions) {
            const x = zoomedToRadarX(position.x, position.z);
            const y = zoomedToRadarY(position.y, position.z);
            const radius = position.state === HostageState.BeingCarried ? zoomedSize(4) : zoomedSize(8);
            context.beginPath();
            context.arc(x, y, radius, 0, 2 * Math.PI);
            context.strokeStyle = 'white';
            context.fillStyle = 'brown';
            context.lineWidth = zoomedSize(1);
            context.fill();
            context.stroke();
        }
    };
    return { drawHostages };
}
//# sourceMappingURL=use-draw-hostages.js.map