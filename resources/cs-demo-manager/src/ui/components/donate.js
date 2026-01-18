import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ExternalLink } from './external-link';
export function Donate() {
    return (React.createElement("div", { className: "flex flex-col" },
        React.createElement("h3", { className: "text-subtitle" },
            React.createElement(Trans, null, "Donate")),
        React.createElement("p", null,
            React.createElement(Trans, null, "CS Demo Manager is a project that I started during college in 2014 and maintained as much as I can since then.")),
        React.createElement("p", null,
            React.createElement(Trans, null, "It's not backed by any corporate entity and is a free and open-source software that I hope you enjoy using.")),
        React.createElement("p", null,
            React.createElement(Trans, null,
                "Your ",
                React.createElement(ExternalLink, { href: "https://cs-demo-manager.com/download" }, "donation"),
                " is greatly appreciated and motivates me to continue working on CS Demo Manager. Thank you!"))));
}
//# sourceMappingURL=donate.js.map