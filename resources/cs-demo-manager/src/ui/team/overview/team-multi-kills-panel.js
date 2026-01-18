import React from 'react';
import { MultiKillsPanel } from 'csdm/ui/components/panels/multi-kills-panel';
import { useTeam } from '../use-team';
export function TeamMultiKillsPanel() {
    const { oneKillCount, twoKillCount, threeKillCount, fourKillCount, fiveKillCount } = useTeam();
    return (React.createElement(MultiKillsPanel, { oneKillCount: oneKillCount, twoKillCount: twoKillCount, threeKillCount: threeKillCount, fourKillCount: fourKillCount, fiveKillCount: fiveKillCount }));
}
//# sourceMappingURL=team-multi-kills-panel.js.map