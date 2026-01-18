import React from 'react';
import { Trans } from '@lingui/react/macro';
import { LeftBarLink } from './left-bar-link';
import { RoutePath } from 'csdm/ui/routes-paths';
import { TeamIcon } from 'csdm/ui/icons/team-icon';
export function TeamsLink() {
    return React.createElement(LeftBarLink, { icon: React.createElement(TeamIcon, null), tooltip: React.createElement(Trans, { context: "Tooltip" }, "Teams"), url: RoutePath.Teams });
}
//# sourceMappingURL=teams-link.js.map