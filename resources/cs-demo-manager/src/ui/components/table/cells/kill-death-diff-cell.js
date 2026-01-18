import React from 'react';
import clsx from 'clsx';
export function KillDeathDiffCell({ data }) {
    const diff = data.killCount - data.deathCount;
    const text = diff > 0 ? `+${diff}` : diff.toString();
    return (React.createElement("span", { className: clsx('selectable', {
            'text-gray-800': diff === 0,
            'text-green-700': diff > 0,
            'text-red-400': diff < 0,
        }) }, text));
}
//# sourceMappingURL=kill-death-diff-cell.js.map