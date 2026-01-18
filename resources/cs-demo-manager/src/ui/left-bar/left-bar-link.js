import React from 'react';
import { NavLink } from 'react-router';
import { LeftBarTooltip } from './left-bar-tooltip';
export function LeftBarLink({ url, tooltip, icon, onClick }) {
    return (React.createElement(LeftBarTooltip, { content: tooltip },
        React.createElement(NavLink, { to: url, onClick: onClick, className: ({ isActive }) => {
                return `flex flex-col items-center w-full no-underline hover:text-gray-900 duration-85 transition-all py-12 outline-hidden ${isActive ? 'text-gray-900' : 'text-gray-500'}`;
            }, viewTransition: true },
            React.createElement("div", { className: "flex w-32 justify-center" }, icon))));
}
//# sourceMappingURL=left-bar-link.js.map