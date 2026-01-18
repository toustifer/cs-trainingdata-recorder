import React from 'react';
import { Trans } from '@lingui/react/macro';
import { FlashbangLabels } from 'csdm/ui/match/grenades/stats/labels/flashbang-labels';
import { FireLabels } from 'csdm/ui/match/grenades/stats/labels/fire-labels';
import { HeGrenadeLabels } from 'csdm/ui/match/grenades/stats/labels/he-grenade-labels';
import { GrenadeOption } from 'csdm/ui/match/grenades/stats/grenade-option';
import { StatLabel } from 'csdm/ui/match/grenades/stats/labels/label';
function renderLabelsForGrenade(grenade) {
    switch (grenade) {
        case GrenadeOption.Flashbang:
            return React.createElement(FlashbangLabels, null);
        case GrenadeOption.Fire:
            return React.createElement(FireLabels, null);
        case GrenadeOption.HE:
            return React.createElement(HeGrenadeLabels, null);
        case GrenadeOption.Smoke:
            return null;
        default:
            logger.warn(`Unknown grenade type ${grenade}`);
            return null;
    }
}
export function StatsLabel({ grenade }) {
    return (React.createElement("div", { className: "col-start-2 row-start-2 mx-8 mt-auto" },
        React.createElement(StatLabel, { text: React.createElement(Trans, null, "Thrown") }),
        renderLabelsForGrenade(grenade)));
}
//# sourceMappingURL=stats-label.js.map