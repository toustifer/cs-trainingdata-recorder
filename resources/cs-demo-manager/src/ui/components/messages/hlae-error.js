import { Trans } from '@lingui/react/macro';
import React from 'react';
import { ExternalLink } from '../external-link';
export function HlaeError() {
    return (React.createElement("div", { className: "flex flex-col gap-x-4" },
        React.createElement("span", null,
            React.createElement(Trans, null, "HLAE returned an error.")),
        React.createElement("span", null,
            React.createElement(Trans, null,
                "Make sure HLAE is up to date and compatible with the last CS2 version on",
                ' ',
                React.createElement(ExternalLink, { href: "https://github.com/advancedfx/advancedfx/issues?q=sort%3Aupdated-desc+is%3Aissue+is%3Aopen" }, "GitHub"),
                ' ',
                "or ",
                React.createElement(ExternalLink, { href: "https://discord.com/invite/NGp8qhN" }, "Discord"),
                "."))));
}
//# sourceMappingURL=hlae-error.js.map