import React from 'react';
import { Link } from 'react-router';
import { Trans } from '@lingui/react/macro';
import { Panel, PanelTitle } from 'csdm/ui/components/panel';
import { Avatar } from 'csdm/ui/components/avatar';
import { buildPlayerPath } from 'csdm/ui/routes-paths';
import { useFormatDate } from 'csdm/ui/hooks/use-format-date';
import { NoBanMessage } from './no-ban-message';
export function LastBans({ bannedAccounts }) {
    const formatDate = useFormatDate();
    return (React.createElement(Panel, { header: React.createElement(PanelTitle, null,
            React.createElement(Trans, null, "Last bans")) },
        React.createElement("div", { className: "flex gap-x-8" }, bannedAccounts.length === 0 ? (React.createElement(NoBanMessage, null)) : (bannedAccounts.slice(0, 8).map((account) => {
            return (React.createElement(Link, { key: account.steamId, className: "flex flex-none gap-x-4 rounded p-8 hover:bg-gray-100", to: buildPlayerPath(account.steamId), viewTransition: true },
                React.createElement(Avatar, { avatarUrl: account.avatar, playerName: account.name, size: 48 }),
                React.createElement("div", { className: "flex flex-col justify-center" },
                    React.createElement("p", { className: "text-body-strong" }, account.name),
                    React.createElement("p", null, formatDate(account.lastBanDate, {
                        hour: undefined,
                        minute: undefined,
                        second: undefined,
                    })))));
        })))));
}
//# sourceMappingURL=last-bans.js.map