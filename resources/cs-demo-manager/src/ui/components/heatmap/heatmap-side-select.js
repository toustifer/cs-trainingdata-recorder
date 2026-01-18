import React from 'react';
import { SideSelect } from 'csdm/ui/components/inputs/select/side-select';
export function HeatmapSideSelect({ sides, onChange }) {
    return (React.createElement(SideSelect, { selectedSides: sides, onChange: (selectedSide) => {
            onChange(selectedSide === undefined ? [] : [selectedSide]);
        } }));
}
//# sourceMappingURL=heatmap-side-select.js.map