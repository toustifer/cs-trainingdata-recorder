import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Select } from 'csdm/ui/components/inputs/select';
import { InputLabel } from 'csdm/ui/components/inputs/input-label';
export function CamerasMapInput({ maps, mapName, onChange }) {
    if (maps.length === 0) {
        return null;
    }
    const mapsOptions = maps.map(({ name }) => {
        return {
            value: name,
            label: name,
        };
    });
    return (React.createElement("div", { className: "flex items-center gap-x-8" },
        React.createElement(InputLabel, null,
            React.createElement(Trans, { context: "Select label" }, "Map")),
        React.createElement(Select, { options: mapsOptions, value: mapName, onChange: onChange })));
}
//# sourceMappingURL=cameras-map-input.js.map