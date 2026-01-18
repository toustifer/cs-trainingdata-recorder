import React from 'react';
export function VerticalSlider({ value, onChange, min, max, step }) {
    return (React.createElement("div", { className: "flex h-[120px] w-40 items-center justify-center bg-gray-100 py-8" },
        React.createElement("input", { type: "range", value: value, onChange: onChange, min: min, max: max, step: step, className: "h-full w-12 appearance-v-slider focus-visible:outline-none" })));
}
//# sourceMappingURL=vertical-slider.js.map