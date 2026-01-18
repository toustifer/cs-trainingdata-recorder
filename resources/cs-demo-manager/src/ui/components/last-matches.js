import React from 'react';
import { Trans } from '@lingui/react/macro';
import { LastMatch } from './last-match';
import { Panel, PanelTitle } from 'csdm/ui/components/panel';
function renderMatches(matches) {
    if (matches.length === 0) {
        return (React.createElement("p", null,
            React.createElement(Trans, null, "No matches.")));
    }
    return matches.map((match) => {
        return React.createElement(LastMatch, { key: match.checksum, match: match });
    });
}
export function LastMatches({ matches }) {
    return (React.createElement(Panel, { header: React.createElement(PanelTitle, null,
            React.createElement(Trans, { context: "Panel title" }, "Last matches")) },
        React.createElement("div", { className: "flex gap-x-12" }, renderMatches(matches))));
}
//# sourceMappingURL=last-matches.js.map