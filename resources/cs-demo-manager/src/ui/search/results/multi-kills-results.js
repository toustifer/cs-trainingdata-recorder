import React from 'react';
import { KillFeedEntry } from 'csdm/ui/components/kill-feed-entry';
import { CollapsePanel } from 'csdm/ui/components/collapse-panel/collapse-panel';
import { WatchButton } from 'csdm/ui/components/buttons/watch-button';
import { VirtualListResults } from './virtual-list-results';
import { DotSeparator } from './dot-separator';
import { ActionDuration, MapImage, MatchDate, PlayerName, RoundNumber, RowLeft, RowRight, TeamSideIcon, } from './result-row';
import { SeeMatchButton } from 'csdm/ui/components/buttons/see-match-button';
import { SeeRoundLink } from 'csdm/ui/components/links/see-round-link';
import { RoundCommentIcon } from 'csdm/ui/match/rounds/round/round-comment-icon';
import { Markdown } from 'csdm/ui/components/markdown';
import { lastArrayItem } from 'csdm/common/array/last-array-item';
export function MultiKillsResults({ multiKills }) {
    return (React.createElement(VirtualListResults, { items: multiKills, renderItem: (multiKill) => {
            if (multiKill.kills.length < 2) {
                return null;
            }
            const [firstKill] = multiKill.kills;
            const lastKill = lastArrayItem(multiKill.kills);
            return (React.createElement(CollapsePanel, { key: multiKill.id, header: React.createElement("div", { className: "flex flex-1 items-center justify-between gap-x-8 overflow-x-auto" },
                    React.createElement(RowLeft, null,
                        React.createElement(MapImage, { mapName: multiKill.mapName }),
                        React.createElement(TeamSideIcon, { side: multiKill.side }),
                        React.createElement(PlayerName, { name: multiKill.killerName }),
                        React.createElement(DotSeparator, null),
                        React.createElement("p", null, multiKill.mapName),
                        React.createElement(DotSeparator, null),
                        React.createElement(RoundNumber, { roundNumber: multiKill.roundNumber }),
                        React.createElement(DotSeparator, null),
                        React.createElement(MatchDate, { date: multiKill.date }),
                        React.createElement(DotSeparator, null),
                        React.createElement(ActionDuration, { startTick: firstKill.tick, endTick: lastKill.tick, tickrate: multiKill.matchTickrate }),
                        multiKill.roundComment && (React.createElement(React.Fragment, null,
                            React.createElement(DotSeparator, null),
                            React.createElement(RoundCommentIcon, { comment: multiKill.roundComment })))),
                    React.createElement(RowRight, null,
                        React.createElement(WatchButton, { demoPath: multiKill.demoPath, tick: multiKill.tick - multiKill.matchTickrate * 5, focusSteamId: multiKill.killerSteamId, game: multiKill.game }),
                        React.createElement(SeeRoundLink, { checksum: multiKill.matchChecksum, roundNumber: multiKill.roundNumber }),
                        React.createElement(SeeMatchButton, { checksum: multiKill.matchChecksum }))) },
                React.createElement("div", { className: "flex gap-x-10 overflow-hidden" },
                    React.createElement("div", { className: "flex flex-col" }, multiKill.kills.map((kill) => {
                        return React.createElement(KillFeedEntry, { key: kill.id, kill: kill });
                    })),
                    multiKill.roundComment && (React.createElement("div", { className: "max-h-[160px] w-full overflow-auto" },
                        React.createElement(Markdown, { markdown: multiKill.roundComment }))))));
        } }));
}
//# sourceMappingURL=multi-kills-results.js.map