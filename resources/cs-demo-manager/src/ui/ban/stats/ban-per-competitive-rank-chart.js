import React from 'react';
import { Trans } from '@lingui/react/macro';
import { CompetitiveRank } from 'csdm/common/types/counter-strike';
import { NoBanMessage } from './no-ban-message';
import { Panel, PanelTitle } from 'csdm/ui/components/panel';
import { Tooltip } from 'csdm/ui/components/tooltip';
import { useGetRankName } from 'csdm/ui/hooks/use-get-rank-name';
export function BanPerCompetitiveRankChart({ bannedAccounts }) {
    const getRankName = useGetRankName();
    const renderContent = () => {
        const banCountPerRank = new Map();
        for (const account of bannedAccounts) {
            if (account.rank > CompetitiveRank.GlobalElite) {
                continue;
            }
            const rank = account.rank;
            banCountPerRank.set(rank, (banCountPerRank.get(rank) ?? 0) + 1);
        }
        if (banCountPerRank.size === 0) {
            return React.createElement(NoBanMessage, null);
        }
        const maxBannedCount = Math.max(...banCountPerRank.values());
        return (React.createElement("div", { className: "mx-auto flex w-max gap-x-4" }, Object.values(CompetitiveRank).map((rankNumber) => {
            const bannedCount = banCountPerRank.get(rankNumber) ?? 0;
            const rankName = getRankName(rankNumber);
            return (React.createElement("div", { key: rankNumber, className: "flex" },
                React.createElement("div", { className: "flex h-[324px] flex-col items-center justify-end" },
                    bannedCount > 0 && (React.createElement(Tooltip, { content: `${rankName}: ${bannedCount}`, placement: "top" },
                        React.createElement("div", { className: "flex w-40 animate-grow-height justify-center bg-blue-700", style: {
                                height: `${(bannedCount / maxBannedCount) * 100}%`,
                            } },
                            React.createElement("span", { className: "text-white" }, bannedCount)))),
                    React.createElement("img", { className: "mt-4 w-[64px]", src: window.csdm.getRankImageSrc(rankNumber), alt: rankName, title: rankName }))));
        })));
    };
    return (React.createElement(Panel, { header: React.createElement(PanelTitle, null,
            React.createElement(Trans, { context: "Chart title" }, "Ban per competitive rank")) }, renderContent()));
}
//# sourceMappingURL=ban-per-competitive-rank-chart.js.map