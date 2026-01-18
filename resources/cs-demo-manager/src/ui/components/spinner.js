import React from 'react';
export function Spinner({ ref, size }) {
    return (React.createElement("div", { ref: ref, className: "animate-spin rounded-full border-4 border-gray-800 border-t-gray-400", style: {
            width: `${size}px`,
            height: `${size}px`,
        } }));
}
//# sourceMappingURL=spinner.js.map