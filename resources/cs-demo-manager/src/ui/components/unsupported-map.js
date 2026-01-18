import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ExternalLink } from 'csdm/ui/components/external-link';
import { CenteredContent } from 'csdm/ui/components/content';
export function UnsupportedMap() {
    return (React.createElement(CenteredContent, null,
        React.createElement("p", { className: "text-subtitle" },
            React.createElement(Trans, null, "Map not supported.")),
        React.createElement("p", null,
            React.createElement(Trans, null,
                "You can add custom maps from settings, please read the",
                React.createElement(ExternalLink, { href: "https://cs-demo-manager.com/docs/guides/maps" }, " documentation "),
                "for more details."))));
}
//# sourceMappingURL=unsupported-map.js.map