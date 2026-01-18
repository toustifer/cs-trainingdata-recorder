import React from 'react';
import { NumberBadge } from '../number-badge';
export function TabLinkNumberBadge({ number }) {
    return (React.createElement("div", { className: "absolute top-0 -right-4" },
        React.createElement(NumberBadge, { number: number })));
}
//# sourceMappingURL=tab-link-number-badge.js.map