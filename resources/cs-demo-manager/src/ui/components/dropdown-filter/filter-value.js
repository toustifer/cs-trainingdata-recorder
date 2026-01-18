import React from 'react';
import clsx from 'clsx';
export function FilterValue({ isSelected, onClick, children }) {
    return (React.createElement("button", { className: clsx('flex min-w-32 cursor-default items-center justify-center rounded border px-8 py-4 text-caption select-none hover:text-gray-900', isSelected
            ? 'border-gray-400 bg-gray-50 text-gray-900 hover:bg-gray-100'
            : 'border-transparent bg-gray-200 text-gray-600'), onClick: onClick }, children));
}
//# sourceMappingURL=filter-value.js.map