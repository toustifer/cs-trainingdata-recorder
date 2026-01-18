import React from 'react';
import { Navigate } from 'react-router';
import { Trans } from '@lingui/react/macro';
import { usePinnedPlayerSteamId } from 'csdm/ui/settings/use-pinned-player-steamid';
import { CenteredContent } from 'csdm/ui/components/content';
import { buildPlayerPath } from '../routes-paths';
import { isEmptyString } from 'csdm/common/string/is-empty-string';
export function PinnedPlayer() {
    const pinnedPlayerSteamId = usePinnedPlayerSteamId();
    if (pinnedPlayerSteamId === undefined || isEmptyString(pinnedPlayerSteamId)) {
        return (React.createElement(CenteredContent, null,
            React.createElement("p", null,
                React.createElement(Trans, null, "No pinned player found.")),
            React.createElement("p", null,
                React.createElement(Trans, null, "You can pin a player from scoreboards or the players list."))));
    }
    return React.createElement(Navigate, { to: buildPlayerPath(pinnedPlayerSteamId) });
}
//# sourceMappingURL=pinned-player.js.map