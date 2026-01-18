import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Select } from 'csdm/ui/components/inputs/select';
import { useHeatmapContext } from 'csdm/ui/components/heatmap/heatmap-context';
import { InputLabel } from 'csdm/ui/components/inputs/input-label';
export function HeatmapSelectMap({ mapNames }) {
    const { mapName, fetchPoints } = useHeatmapContext();
    const options = mapNames.map((mapName) => {
        return {
            value: mapName,
            label: mapName,
        };
    });
    return (React.createElement("div", { className: "flex flex-col gap-y-8" },
        React.createElement(InputLabel, null,
            React.createElement(Trans, { context: "Input label" }, "Map")),
        React.createElement(Select, { options: options, value: mapName, onChange: (mapName) => {
                fetchPoints({ mapName });
            } })));
}
//# sourceMappingURL=heatmap-select-map.js.map