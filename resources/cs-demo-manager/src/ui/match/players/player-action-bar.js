import React from 'react';
import { useNavigate } from 'react-router';
import { Trans } from '@lingui/react/macro';
import { ShieldIcon } from 'csdm/ui/icons/shield-icon';
import { buildPlayerPath } from 'csdm/ui/routes-paths';
import { ActionBar } from 'csdm/ui/components/action-bar';
import { Avatar } from 'csdm/ui/components/avatar';
import { Button } from 'csdm/ui/components/buttons/button';
import { Tooltip } from 'csdm/ui/components/tooltip';
import { buildPlayerSteamProfileUrl } from 'csdm/ui/shared/build-player-steam-profile-url';
import { CopySteamIdButton } from 'csdm/ui/components/buttons/copy-steamid-button';
import { CompetitiveRank } from 'csdm/common/types/counter-strike';
import { PremierRank } from 'csdm/ui/components/premier-rank';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { PlayersTagsDialog } from 'csdm/ui/players/players-tags-dialogs';
import { Tags } from 'csdm/ui/components/tags/tags';
export function PlayerActionBar({ player }) {
    const navigate = useNavigate();
    const { showDialog } = useDialog();
    const onEditTagsClick = () => {
        showDialog(React.createElement(PlayersTagsDialog, { steamIds: [player.steamId], defaultTagIds: player.tagIds }));
    };
    return (React.createElement(ActionBar, { left: React.createElement("div", { className: "flex w-max items-center gap-x-8" },
            React.createElement("a", { href: buildPlayerSteamProfileUrl(player.steamId), target: "_blank", rel: "noreferrer", className: "flex items-center gap-x-4" },
                React.createElement(Avatar, { avatarUrl: player.avatar, playerName: player.name, size: 30 }),
                React.createElement("p", { className: "text-body-strong" }, player.name)),
            React.createElement("div", { className: "w-[64px]" }, player.rank > CompetitiveRank.GlobalElite ? (React.createElement(PremierRank, { rank: player.rank })) : (React.createElement("img", { src: window.csdm.getRankImageSrc(player.rank) }))),
            React.createElement("p", null, player.teamName),
            player.lastBanDate && (React.createElement(Tooltip, { content: React.createElement(Trans, { context: "Tooltip" }, "Banned player") },
                React.createElement(ShieldIcon, { width: 20, height: 20, className: "text-red-600" }))),
            React.createElement(Tags, { tagIds: player.tagIds, onEditClick: onEditTagsClick })), right: React.createElement(React.Fragment, null,
            React.createElement(CopySteamIdButton, { steamId: player.steamId }),
            React.createElement(Button, { onClick: () => {
                    navigate(buildPlayerPath(player.steamId));
                } },
                React.createElement(Trans, { context: "Button" }, "See global stats"))) }));
}
//# sourceMappingURL=player-action-bar.js.map