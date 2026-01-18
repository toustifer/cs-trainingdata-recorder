import React from 'react';
import { Avatar } from 'csdm/ui/components/avatar';
import { buildPlayerSteamProfileUrl } from 'csdm/ui/shared/build-player-steam-profile-url';
export function PlayerSteamLink({ player }) {
    return (React.createElement("a", { href: buildPlayerSteamProfileUrl(player.steamId), target: "_blank", rel: "noreferrer", className: "flex w-max items-center gap-x-4" },
        React.createElement(Avatar, { avatarUrl: player.avatar, size: 30 }),
        React.createElement("p", { className: "text-body-strong" }, player.name)));
}
//# sourceMappingURL=player-steam-link.js.map