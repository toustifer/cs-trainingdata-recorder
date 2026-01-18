import React from 'react';
import { Trans } from '@lingui/react/macro';
import { RangeInput } from './range-input';
export function OpacityInput({ value, onChange }) {
    return (React.createElement(RangeInput, { label: React.createElement(Trans, { context: "Input label" }, "Opacity"), value: value, onChange: onChange, min: 0, step: 0.1, max: 1 }));
}
//# sourceMappingURL=opacity-input.js.map