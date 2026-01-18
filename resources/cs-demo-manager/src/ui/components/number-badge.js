import React from 'react';
import { motion } from 'motion/react';
export function NumberBadge({ number }) {
    if (number === 0) {
        return null;
    }
    return (React.createElement(motion.div, { className: "flex h-20 min-w-20 items-center justify-center rounded-full bg-blue-700 px-4 text-center text-white transition-[300ms]", animate: { translateY: [0, -60, 0], scale: [1, 4.5, 1], transition: { duration: 0.5 } } },
        React.createElement("p", { className: "text-caption" }, number)));
}
//# sourceMappingURL=number-badge.js.map