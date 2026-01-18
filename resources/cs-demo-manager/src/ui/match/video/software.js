import React from 'react';
import { Trans } from '@lingui/react/macro';
export function Software({ name, version, websiteLink, children }) {
    return (React.createElement("div", { className: "flex flex-col" },
        React.createElement("div", { className: "flex gap-x-8" },
            React.createElement("a", { href: websiteLink, target: "_blank", rel: "noreferrer", className: "underline" }, name),
            React.createElement("p", null, version ?? React.createElement(Trans, { context: "Software installation status" }, "Not installed"))),
        React.createElement("div", { className: "mt-8 flex gap-x-8" }, children)));
}
//# sourceMappingURL=software.js.map