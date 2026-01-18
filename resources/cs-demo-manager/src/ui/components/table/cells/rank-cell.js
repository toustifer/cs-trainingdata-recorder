import React from 'react';
import { CompetitiveRank } from 'csdm/common/types/counter-strike';
import { PremierRank } from 'csdm/ui/components/premier-rank';
import { useGetRankName } from 'csdm/ui/hooks/use-get-rank-name';
export function RankCell({ data }) {
    const rank = data.rank;
    const getRankName = useGetRankName();
    if (data.rank > CompetitiveRank.GlobalElite) {
        return React.createElement(PremierRank, { rank: data.rank });
    }
    const rankImageSrc = window.csdm.getRankImageSrc(rank);
    const rankName = getRankName(rank);
    return React.createElement("img", { src: rankImageSrc, alt: rankName, title: rankName });
}
//# sourceMappingURL=rank-cell.js.map