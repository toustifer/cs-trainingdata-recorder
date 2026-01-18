import React from 'react';
import clsx from 'clsx';
export function Control({ children, onClick, variant }) {
    return (React.createElement("div", { className: clsx('flex h-full w-48 items-center justify-center', variant === 'danger' ? 'hover:bg-[#c42b1c]' : 'hover:bg-gray-300'), onClick: onClick }, children));
}
//# sourceMappingURL=control.js.map