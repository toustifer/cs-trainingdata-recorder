import React from 'react';
import { Trans } from '@lingui/react/macro';
import { CenteredContent } from 'csdm/ui/components/content';
export function NoStats() {
    return (React.createElement(CenteredContent, null,
        React.createElement("p", { className: "text-subtitle" },
            React.createElement(Trans, null, "No VAC ban stats to show, you must analyze demos to generate stats."))));
}
//# sourceMappingURL=no-stats.js.map