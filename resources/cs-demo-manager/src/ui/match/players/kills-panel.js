import React from 'react';
import { Trans } from '@lingui/react/macro';
import { KillFeedEntry } from 'csdm/ui/components/kill-feed-entry';
import { PlayDemoAtTickButton } from 'csdm/ui/match/rounds/play-demo-at-tick-button';
import { Panel } from 'csdm/ui/components/panel';
import { useCurrentMatch } from '../use-current-match';
export function KillsPanel({ header, kills, demoPath, tickrate, rounds }) {
    const match = useCurrentMatch();
    const sortedKills = kills.toSorted((killA, killB) => killA.tick - killB.tick);
    return (React.createElement(Panel, { header: header, fitHeight: true },
        React.createElement("div", { className: "flex flex-col gap-y-4" }, sortedKills.map((kill, index) => {
            const { tick, victimName, killerSteamId, roundNumber } = kill;
            const round = rounds.find((round) => round.number === roundNumber);
            const previousRoundNumber = index > 0 ? sortedKills[index - 1].roundNumber : 0;
            return (React.createElement("div", { key: `kill-${tick}-${victimName}` },
                roundNumber !== previousRoundNumber && (React.createElement("p", { className: "text-gray-900" },
                    React.createElement(Trans, null,
                        "Round ",
                        roundNumber))),
                React.createElement(KillFeedEntry, { kill: kill, timeElapsedOption: {
                        tickrate: match.tickrate,
                        roundFreezetimeEndTick: round?.freezetimeEndTick ?? 1,
                    }, right: React.createElement(PlayDemoAtTickButton, { demoPath: demoPath, game: match.game, tick: tick - tickrate * 5, size: 20, focusSteamId: killerSteamId === null ? undefined : killerSteamId, tooltip: React.createElement(Trans, { context: "Tooltip" }, "Watch kill") }) })));
        }))));
}
//# sourceMappingURL=kills-panel.js.map