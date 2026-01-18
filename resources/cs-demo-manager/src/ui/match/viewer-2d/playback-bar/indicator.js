import React from 'react';
export function Indicator({ ref, color, leftX }) {
    return (React.createElement("div", { ref: ref, className: "absolute h-full w-[2px]", style: {
            backgroundColor: color,
            left: `${leftX}px`,
        } }));
}
//# sourceMappingURL=indicator.js.map