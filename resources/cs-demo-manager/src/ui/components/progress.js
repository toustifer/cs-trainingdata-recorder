import React from 'react';
export function Progress({ max = 100, value }) {
    return (React.createElement("progress", { max: max, value: value }, `${value}%`));
}
//# sourceMappingURL=progress.js.map