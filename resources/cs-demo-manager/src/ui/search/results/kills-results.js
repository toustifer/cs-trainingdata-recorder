import React from 'react';
import { Trans } from '@lingui/react/macro';
import { WatchButton } from 'csdm/ui/components/buttons/watch-button';
import { KillFeedEntry } from 'csdm/ui/components/kill-feed-entry';
import { CollapsePanel } from 'csdm/ui/components/collapse-panel/collapse-panel';
import { VirtualListResults } from './virtual-list-results';
import { DotSeparator } from './dot-separator';
import { MapImage, MatchDate, PlayerName, RoundNumber, RowLeft, RowRight, TeamSideIcon } from './result-row';
import { SeeMatchButton } from 'csdm/ui/components/buttons/see-match-button';
import { SeeRoundLink } from 'csdm/ui/components/links/see-round-link';
import { RoundCommentIcon } from 'csdm/ui/match/rounds/round/round-comment-icon';
import { Markdown } from 'csdm/ui/components/markdown';
export function KillsResults({ kills }) {
    return (React.createElement(VirtualListResults, { items: kills, renderItem: (kill) => {
            const deathCount = kill.kills.length;
            const isSingleKill = deathCount === 1;
            return (React.createElement(CollapsePanel, { key: kill.id, isEnabled: !isSingleKill, header: React.createElement("div", { className: "flex flex-1 items-center justify-between gap-x-8 overflow-x-auto" },
                    React.createElement(RowLeft, null,
                        React.createElement(MapImage, { mapName: kill.mapName }),
                        isSingleKill ? (React.createElement("div", null,
                            React.createElement(KillFeedEntry, { kill: kill.kills[0] }))) : (React.createElement(React.Fragment, null,
                            React.createElement(TeamSideIcon, { side: kill.side }),
                            React.createElement(PlayerName, { name: kill.killerName }))),
                        React.createElement(DotSeparator, null),
                        React.createElement("p", null, kill.mapName),
                        React.createElement(DotSeparator, null),
                        React.createElement(RoundNumber, { roundNumber: kill.roundNumber }),
                        React.createElement(DotSeparator, null),
                        kill.kills.length > 1 && (React.createElement(React.Fragment, null,
                            React.createElement("p", null,
                                React.createElement(Trans, null,
                                    "Deaths ",
                                    deathCount)),
                            React.createElement(DotSeparator, null))),
                        React.createElement(MatchDate, { date: kill.date }),
                        kill.roundComment && (React.createElement(React.Fragment, null,
                            React.createElement(DotSeparator, null),
                            React.createElement(RoundCommentIcon, { comment: kill.roundComment })))),
                    React.createElement(RowRight, null,
                        React.createElement(WatchButton, { demoPath: kill.demoPath, tick: kill.tick - 64 * 5, focusSteamId: kill.killerSteamId, game: kill.game }),
                        React.createElement(SeeRoundLink, { checksum: kill.matchChecksum, roundNumber: kill.roundNumber }),
                        React.createElement(SeeMatchButton, { checksum: kill.matchChecksum }))) }, kill.kills.length > 1 && (React.createElement("div", { className: "flex gap-x-10 overflow-hidden" },
                React.createElement("div", { className: "flex flex-col" }, kill.kills.map((kill) => {
                    return React.createElement(KillFeedEntry, { key: kill.id, kill: kill });
                })),
                kill.roundComment && (React.createElement("div", { className: "max-h-[160px] w-full overflow-auto" },
                    React.createElement(Markdown, { markdown: kill.roundComment })))))));
        } }));
}
//# sourceMappingURL=kills-results.js.map