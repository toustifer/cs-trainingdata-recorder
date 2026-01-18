import React from 'react';
import { Trans } from '@lingui/react/macro';
import { RoutePath } from 'csdm/ui/routes-paths';
import { PendingIcon } from 'csdm/ui/icons/pending-icon';
import { LeftBarLink } from './left-bar-link';
import { PendingAnalysesBadge } from './pending-analyses-badge';
export function AnalysesLink() {
    return (React.createElement(LeftBarLink, { icon: React.createElement("div", { className: "relative size-full" },
            React.createElement(PendingAnalysesBadge, null),
            React.createElement(PendingIcon, null)), tooltip: React.createElement(Trans, { context: "Tooltip" }, "Analyses"), url: RoutePath.Analyses }));
}
//# sourceMappingURL=analyses-link.js.map