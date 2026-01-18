import React from 'react';
import { ArmorIcon } from 'csdm/ui/icons/armor-icon';
import { ArmorWithHelmetIcon } from 'csdm/ui/icons/armor-with-helmet-icon';
function Wrapper({ children }) {
    return React.createElement("div", { className: "absolute bottom-4 left-4" }, children);
}
export function ArmorIndicator({ armor, hasHelmet }) {
    if (hasHelmet) {
        return (React.createElement(Wrapper, null,
            React.createElement(ArmorWithHelmetIcon, { size: 16 })));
    }
    if (armor > 0) {
        return (React.createElement(Wrapper, null,
            React.createElement(ArmorIcon, { size: 16 })));
    }
    return null;
}
//# sourceMappingURL=armor-indicator.js.map