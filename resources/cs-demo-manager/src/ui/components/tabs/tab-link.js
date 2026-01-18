import React from 'react';
import { NavLink, useLocation } from 'react-router';
export function TabLink({ children, url, end = true }) {
    const { state } = useLocation();
    return (React.createElement(NavLink, { to: url, end: end, state: state, className: ({ isActive }) => {
            return `relative flex items-center h-full px-8 no-underline text-body-strong text-gray-900 hover:opacity-100 min-w-fit ${isActive ? '' : 'opacity-60'}`;
        }, viewTransition: true }, children));
}
//# sourceMappingURL=tab-link.js.map