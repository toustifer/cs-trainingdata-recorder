import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ExternalLink } from 'csdm/ui/components/external-link';
export function FiveEPlayAccountInstructions() {
    return (React.createElement("div", { className: "flex flex-col gap-y-8" },
        React.createElement("h2", { className: "text-title" },
            React.createElement(Trans, null, "How can I find my 5EPlay ID?")),
        React.createElement("ol", { className: "list-inside list-decimal" },
            React.createElement("li", null,
                React.createElement(Trans, null,
                    "Log into your ",
                    React.createElement(ExternalLink, { href: "https://www.5eplay.com/" }, "5EPlay"),
                    " account.")),
            React.createElement("li", null,
                React.createElement(Trans, null, "Go to your profile and copy the last segment of the URL."),
                React.createElement("p", null,
                    React.createElement(Trans, null,
                        "For example, if the URL is ",
                        React.createElement("strong", null, "https://arena.5eplay.com/data/player/111111"),
                        " then the ID is",
                        ' ',
                        React.createElement("strong", null, "111111"),
                        "."))))));
}
//# sourceMappingURL=five-eplay-account-instructions.js.map