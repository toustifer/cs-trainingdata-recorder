import React from 'react';
import { Trans } from '@lingui/react/macro';
import { DemoField } from './demo-field';
import { useGetMapThumbnailSrc } from 'csdm/ui/maps/use-get-map-thumbnail-src';
export function DemoMap({ mapName, game }) {
    const getMapThumbnailSrc = useGetMapThumbnailSrc();
    return (React.createElement("div", { className: "flex gap-x-8" },
        React.createElement(DemoField, { label: React.createElement(Trans, null, "Map:"), value: mapName }),
        React.createElement("img", { className: "h-40 rounded", src: getMapThumbnailSrc(mapName, game), alt: mapName })));
}
//# sourceMappingURL=demo-map.js.map