import React from 'react';
import { Trans } from '@lingui/react/macro';
import { SyncIcon } from 'csdm/ui/icons/sync-icon';
import { Tooltip } from 'csdm/ui/components/tooltip';
import { useCurrentMatch } from '../../use-current-match';
import { RoundEntry } from './round-entry';
function SideSwitchIndicator() {
    return (React.createElement(Tooltip, { content: React.createElement(Trans, { context: "Tooltip" }, "Switch sides") },
        React.createElement(SyncIcon, { height: 16 })));
}
export function RoundsEntries() {
    const { rounds } = useCurrentMatch();
    return (React.createElement("div", { className: "flex flex-col gap-8" }, rounds.map((round, index) => {
        let isNextRoundSideSwitch = false;
        if (index < rounds.length - 1) {
            isNextRoundSideSwitch = round.teamASide !== rounds[index + 1].teamASide;
        }
        return (React.createElement(React.Fragment, { key: round.number },
            React.createElement(RoundEntry, { round: round }),
            isNextRoundSideSwitch ? React.createElement(SideSwitchIndicator, null) : undefined));
    })));
}
//# sourceMappingURL=rounds-entries.js.map