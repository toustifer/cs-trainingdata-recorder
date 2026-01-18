import React from 'react';
import { Trans } from '@lingui/react/macro';
import { LeftBarLink } from './left-bar-link';
import { RoutePath } from 'csdm/ui/routes-paths';
import { PlayerIcon } from 'csdm/ui/icons/player-icon';
export function PlayersLink() {
    return (React.createElement(LeftBarLink, { icon: React.createElement(PlayerIcon, null), tooltip: React.createElement(Trans, { context: "Tooltip" }, "Players"), url: RoutePath.Players }));
}
//# sourceMappingURL=players-link.js.map