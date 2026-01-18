import React from 'react';
import { Trans } from '@lingui/react/macro';
import { InputLabel } from 'csdm/ui/components/inputs/input-label';
import { Select } from 'csdm/ui/components/inputs/select';
import { RadarLevel } from 'csdm/ui/maps/radar-level';
import { useGetMapRadarSrc } from 'csdm/ui/maps/use-get-map-radar-src';
export function RadarLevelSelect({ onChange, selectedRadarLevel, mapName, game }) {
    const getMapRadarLowerSrc = useGetMapRadarSrc();
    const mapRadarLowerSrc = getMapRadarLowerSrc(mapName, game, RadarLevel.Lower);
    if (mapRadarLowerSrc === undefined) {
        return null;
    }
    const options = [
        {
            label: React.createElement(Trans, null, "Upper"),
            value: RadarLevel.Upper,
        },
        {
            label: React.createElement(Trans, null, "Lower"),
            value: RadarLevel.Lower,
        },
    ];
    return (React.createElement("div", { className: "flex flex-col gap-y-8" },
        React.createElement(InputLabel, null,
            React.createElement(Trans, null, "Radar level")),
        React.createElement(Select, { options: options, value: selectedRadarLevel, onChange: (selectedRadarLevel) => {
                onChange(selectedRadarLevel);
            } })));
}
//# sourceMappingURL=radar-level-select.js.map