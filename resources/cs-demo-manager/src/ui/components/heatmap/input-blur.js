import React from 'react';
import { Trans } from '@lingui/react/macro';
import { useHeatmapContext } from './heatmap-context';
import { RangeInput } from '../inputs/range-input';
export function HeatmapInputBlur({ onChange }) {
    const { blur } = useHeatmapContext();
    return (React.createElement(RangeInput, { label: React.createElement(Trans, { context: "Input label" }, "Blur"), value: blur, onChange: onChange, min: 1, max: 50 }));
}
//# sourceMappingURL=input-blur.js.map