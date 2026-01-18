import React from 'react';
import { scaleStyle } from 'csdm/ui/components/timeline/use-timeline';
export function CameraMarker({ tick, pixelsPerTick, backgroundColor }) {
    const x = tick * pixelsPerTick;
    return (React.createElement("div", { className: "pointer-events-none absolute z-1 h-full w-px origin-left", style: {
            ...scaleStyle,
            left: `${x}px`,
            backgroundColor,
        } }));
}
//# sourceMappingURL=camera-marker.js.map