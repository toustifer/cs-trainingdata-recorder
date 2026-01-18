import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Panel, PanelRow, PanelTitle, PanelValue } from 'csdm/ui/components/panel';
import { usePlayer } from '../use-player';
import { useTranslateEconomyBan } from 'csdm/ui/hooks/use-translate-economy-ban';
import { ShieldIcon } from 'csdm/ui/icons/shield-icon';
import { useFormatDate } from 'csdm/ui/hooks/use-format-date';
import { useBooleanHuman } from 'csdm/ui/hooks/use-boolean-to-human';
export function VacPanel() {
    const { vacBanCount, gameBanCount, lastBanDate, economyBan, hasPrivateProfile, isCommunityBanned } = usePlayer();
    const formatDate = useFormatDate();
    const translateEconomyBan = useTranslateEconomyBan();
    const isBanned = lastBanDate !== null;
    const booleanToHuman = useBooleanHuman();
    return (React.createElement(Panel, { header: React.createElement("div", { className: "flex items-center justify-between" },
            React.createElement(PanelTitle, null,
                React.createElement(Trans, { context: "Panel title" }, "VAC")),
            isBanned && React.createElement(ShieldIcon, { width: 20, height: 20, className: "text-red-600" })), minWidth: 220 },
        React.createElement(PanelRow, null,
            React.createElement("p", null,
                React.createElement(Trans, { context: "Panel label" }, "Bans")),
            React.createElement(PanelValue, null, vacBanCount)),
        React.createElement(PanelRow, null,
            React.createElement("p", null,
                React.createElement(Trans, { context: "Panel label" }, "Game bans")),
            React.createElement(PanelValue, null, gameBanCount)),
        React.createElement(PanelRow, null,
            React.createElement("p", null,
                React.createElement(Trans, { context: "Panel label" }, "Last ban date")),
            lastBanDate && (React.createElement(PanelValue, null, formatDate(lastBanDate, {
                year: 'numeric',
                month: 'numeric',
                day: 'numeric',
            })))),
        React.createElement(PanelRow, null,
            React.createElement("p", null,
                React.createElement(Trans, { context: "Panel label" }, "Economy ban")),
            React.createElement(PanelValue, null, translateEconomyBan(economyBan))),
        React.createElement(PanelRow, null,
            React.createElement("p", null,
                React.createElement(Trans, { context: "Panel label" }, "Community banned")),
            React.createElement(PanelValue, null, booleanToHuman(isCommunityBanned))),
        React.createElement(PanelRow, null,
            React.createElement("p", null,
                React.createElement(Trans, { context: "Panel label" }, "Profile")),
            React.createElement(PanelValue, null, hasPrivateProfile ? React.createElement(Trans, null, "Private") : React.createElement(Trans, null, "Public")))));
}
//# sourceMappingURL=vac-panel.js.map