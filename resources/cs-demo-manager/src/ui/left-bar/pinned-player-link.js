import React from 'react';
import { Trans } from '@lingui/react/macro';
import { LeftBarLink } from './left-bar-link';
import { UserIcon } from 'csdm/ui/icons/user-icon';
import { RoutePath } from 'csdm/ui/routes-paths';
export function PinnedPlayerLink() {
    return (React.createElement(LeftBarLink, { icon: React.createElement(UserIcon, null), tooltip: React.createElement(Trans, { context: "Tooltip" }, "Pinned player"), url: RoutePath.PinnerPlayer }));
}
//# sourceMappingURL=pinned-player-link.js.map