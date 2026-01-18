import React from 'react';
import { Trans } from '@lingui/react/macro';
import { CompetitiveRank } from 'csdm/common/types/counter-strike';
import { NoBanMessage } from './no-ban-message';
import { Panel, PanelTitle } from 'csdm/ui/components/panel';
import { Tooltip } from 'csdm/ui/components/tooltip';
import { PremierRank as PremierRankLogo } from 'csdm/ui/components/premier-rank';
import { getPremierRankTier } from 'csdm/ui/shared/get-premier-rank-tier';
export function BanPerPremierRankChart({ bannedAccounts }) {
    const renderContent = () => {
        const banCountPerTier = new Map();
        for (const account of bannedAccounts) {
            if (account.rank <= CompetitiveRank.GlobalElite) {
                continue;
            }
            const tier = getPremierRankTier(account.rank);
            banCountPerTier.set(tier, (banCountPerTier.get(tier) ?? 0) + 1);
        }
        if (banCountPerTier.size === 0) {
            return React.createElement(NoBanMessage, null);
        }
        const maxBannedCount = Math.max(...banCountPerTier.values());
        return (React.createElement("div", { className: "mx-auto flex w-max gap-x-4" }, [0, 1, 2, 3, 4, 5, 6].map((tier) => {
            const bannedCount = banCountPerTier.get(tier) ?? 0;
            return (React.createElement("div", { key: tier, className: "flex" },
                React.createElement("div", { className: "flex h-[324px] flex-col items-center justify-end" },
                    bannedCount > 0 && (React.createElement(Tooltip, { content: React.createElement(Trans, null,
                            "Tier ",
                            tier,
                            ": ",
                            bannedCount), placement: "top" },
                        React.createElement("div", { className: "flex w-40 animate-grow-height justify-center bg-blue-700", style: {
                                height: `${(bannedCount / maxBannedCount) * 100}%`,
                            } },
                            React.createElement("span", { className: "text-white" }, bannedCount)))),
                    React.createElement("div", { className: "mt-4 w-[64px]" },
                        React.createElement(PremierRankLogo, { rank: tier * 1000 * 5 })))));
        })));
    };
    return (React.createElement(Panel, { header: React.createElement(PanelTitle, null,
            React.createElement(Trans, { context: "Chart title" }, "Ban per Premier rank")) }, renderContent()));
}
//# sourceMappingURL=ban-per-premier-rank-chart.js.map