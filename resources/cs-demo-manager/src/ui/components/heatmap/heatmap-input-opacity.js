import React from 'react';
import { useHeatmapContext } from './heatmap-context';
import { OpacityInput } from '../inputs/opacity-input';
export function HeatmapInputOpacity({ onChange }) {
    const { alpha } = useHeatmapContext();
    return React.createElement(OpacityInput, { value: alpha, onChange: onChange });
}
//# sourceMappingURL=heatmap-input-opacity.js.map