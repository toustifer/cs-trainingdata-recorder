import React, { useEffect, useState } from 'react';
import { Trans } from '@lingui/react/macro';
import { LeftBarLink } from 'csdm/ui/left-bar/left-bar-link';
import { RoutePath } from 'csdm/ui/routes-paths';
import { ShieldIcon } from '../icons/shield-icon';
import { useWebSocketClient } from '../hooks/use-web-socket-client';
import { useLocation } from 'react-router';
import { SharedServerMessageName } from 'csdm/server/shared-server-message-name';
import { LeftBarBadge } from './left-bar-badge';
import { NumberBadge } from '../components/number-badge';
function BanCountBadge({ banCount }) {
    return (React.createElement(LeftBarBadge, null,
        React.createElement(NumberBadge, { number: banCount })));
}
export function BansLink() {
    const location = useLocation();
    const [{ count, lastPathname }, setBanData] = useState({ count: 0, lastPathname: location.pathname });
    const client = useWebSocketClient();
    useEffect(() => {
        const onNewBannedAccounts = (steamIds) => {
            setBanData((prevState) => ({ ...prevState, count: steamIds.length }));
        };
        client.on(SharedServerMessageName.NewBannedAccounts, onNewBannedAccounts);
        return () => {
            client.off(SharedServerMessageName.NewBannedAccounts, onNewBannedAccounts);
        };
    }, [client]);
    const currentPathname = location.pathname;
    if (currentPathname !== lastPathname) {
        // reset the counter only when navigating away from the bans page
        const shouldReset = lastPathname === RoutePath.Ban && currentPathname !== RoutePath.Ban;
        setBanData((prev) => ({
            count: shouldReset ? 0 : prev.count,
            lastPathname: currentPathname,
        }));
    }
    return (React.createElement(LeftBarLink, { icon: React.createElement("div", { className: "relative size-full" },
            React.createElement(BanCountBadge, { banCount: count }),
            React.createElement(ShieldIcon, null)), tooltip: React.createElement(Trans, { context: "Tooltip" }, "VAC bans"), url: RoutePath.Ban }));
}
//# sourceMappingURL=bans-link.js.map