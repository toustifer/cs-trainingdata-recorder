import React, {} from 'react';
export function CollapseTransition({ children, isVisible }) {
    return (React.createElement("div", { className: "grid transition-[grid-template-rows,opacity] duration-200 ease-out", style: {
            gridTemplateRows: isVisible ? '1fr' : '0fr',
            opacity: isVisible ? 1 : 0,
        } },
        React.createElement("div", { className: "overflow-hidden" }, children)));
}
//# sourceMappingURL=collapse-transition.js.map