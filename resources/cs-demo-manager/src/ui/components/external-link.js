import React from 'react';
export function ExternalLink({ href, children }) {
    return (React.createElement("a", { className: "text-blue-500 no-underline hover:underline", href: href, target: "_blank", rel: "noopener noreferrer" }, children));
}
//# sourceMappingURL=external-link.js.map