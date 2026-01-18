import React from 'react';
import { Trans } from '@lingui/react/macro';
import { useHeatmapContext } from './heatmap-context';
import { RangeInput } from '../inputs/range-input';
export function HeatmapInputRadius({ onChange }) {
    const { radius } = useHeatmapContext();
    return (React.createElement(RangeInput, { label: React.createElement(Trans, { context: "Input label" }, "Radius"), value: radius, onChange: onChange, min: 1, max: 50 }));
}
//# sourceMappingURL=input-radius.js.map