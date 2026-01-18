import React from 'react';
import { Trans } from '@lingui/react/macro';
import { CameraEntry } from './camera-entry';
import { useCameras } from 'csdm/ui/cameras/use-cameras';
export function Cameras({ game, mapName }) {
    const cameras = useCameras(game, mapName);
    if (cameras.length === 0) {
        return (React.createElement("p", { className: "text-body-strong" },
            React.createElement(Trans, null,
                "No cameras found for ",
                mapName,
                ".")));
    }
    return (React.createElement("div", { className: "flex flex-wrap gap-8" }, cameras.map((camera) => {
        return React.createElement(CameraEntry, { key: camera.id, camera: camera });
    })));
}
//# sourceMappingURL=cameras.js.map