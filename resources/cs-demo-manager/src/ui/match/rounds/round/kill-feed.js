import React from 'react';
import { Trans } from '@lingui/react/macro';
import { useCurrentRound } from './use-current-round';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { Panel } from 'csdm/ui/components/panel';
import { KillFeedEntry } from 'csdm/ui/components/kill-feed-entry';
import { PlayDemoAtTickButton } from '../play-demo-at-tick-button';
export function KillFeed() {
    const currentRound = useCurrentRound();
    const match = useCurrentMatch();
    const kills = match.kills.filter((kill) => {
        return kill.roundNumber === currentRound.number;
    });
    return (React.createElement(Panel, { header: React.createElement(Trans, { context: "Panel title" }, "Kills"), fitHeight: true },
        React.createElement("div", { className: "flex flex-col gap-y-4" }, kills.map((kill) => {
            const { tick, killerSteamId } = kill;
            return (React.createElement(KillFeedEntry, { key: kill.id, kill: kill, timeElapsedOption: {
                    tickrate: match.tickrate,
                    roundFreezetimeEndTick: currentRound.freezetimeEndTick,
                }, right: React.createElement(PlayDemoAtTickButton, { demoPath: match.demoFilePath, game: match.game, tick: tick - match.tickrate * 5, size: 20, focusSteamId: killerSteamId === null ? undefined : killerSteamId, tooltip: React.createElement(Trans, { context: "Tooltip" }, "Watch kill") }) }));
        }))));
}
//# sourceMappingURL=kill-feed.js.map