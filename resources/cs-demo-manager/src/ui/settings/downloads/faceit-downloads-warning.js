import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ExclamationTriangleIcon } from 'csdm/ui/icons/exclamation-triangle-icon';
import { ExternalLink } from 'csdm/ui/components/external-link';
export function FaceitDownloadsWarning() {
    return (React.createElement("div", { className: "flex items-center gap-x-8" },
        React.createElement(ExclamationTriangleIcon, { className: "size-32 text-red-700" }),
        React.createElement("div", null,
            React.createElement("p", { className: "selectable" },
                React.createElement(Trans, null,
                    "FACEIT restricted demo downloads through a",
                    ' ',
                    React.createElement(ExternalLink, { href: "https://docs.faceit.com/getting-started/Guides/download-api" }, "private API"),
                    ' ',
                    "and recently gave us a server-side API key with the maximum rate limit.")),
            React.createElement("p", { className: "selectable" },
                React.createElement(Trans, null,
                    "You ",
                    React.createElement("strong", null, "don't have to ask"),
                    " FACEIT for an API key. It requires some work, but demo downloads will be back in a near future.")),
            React.createElement("p", { className: "selectable" },
                React.createElement(Trans, null, "In the meantime, you have to download demos from your browser.")))));
}
//# sourceMappingURL=faceit-downloads-warning.js.map