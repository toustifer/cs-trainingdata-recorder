import React from 'react';
import { Link as RouterLink } from 'react-router';
export function Link({ children, to, ...props }) {
    return (React.createElement(RouterLink, { className: "relative flex h-[30px] cursor-default items-center rounded border border-gray-400 bg-gray-50 px-12 leading-none whitespace-nowrap text-gray-800 transition-all duration-85 hover:border-gray-900 hover:text-gray-900 focus:border-gray-800 focus-visible:outline-hidden active:bg-gray-200 aria-disabled:border-transparent aria-disabled:bg-gray-300 aria-disabled:text-gray-600", to: to, ...props }, children));
}
//# sourceMappingURL=link.js.map