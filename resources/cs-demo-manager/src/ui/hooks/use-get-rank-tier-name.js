import { useLingui } from '@lingui/react/macro';
import { CompetitiveRank } from 'csdm/common/types/counter-strike';
export function useGetRankTierName() {
    const { t } = useLingui();
    return (tier) => {
        if (tier === CompetitiveRank.Unknown) {
            return t({
                context: 'CS rank',
                message: `Not ranked`,
            });
        }
        return t({
            context: 'CS premier rank tier',
            message: `Tier ${tier}`,
        });
    };
}
//# sourceMappingURL=use-get-rank-tier-name.js.map