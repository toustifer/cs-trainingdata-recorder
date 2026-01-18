import React from 'react';
import { WatchButton } from 'csdm/ui/components/buttons/watch-button';
import { VirtualListResults } from './virtual-list-results';
import { DotSeparator } from './dot-separator';
import { MapImage, MatchDate, RoundNumber, Row, RowLeft, RowRight } from './result-row';
import { SeeMatchButton } from 'csdm/ui/components/buttons/see-match-button';
import { SeeRoundLink } from 'csdm/ui/components/links/see-round-link';
import { Tags } from 'csdm/ui/components/tags/tags';
import { RoundCommentIcon } from 'csdm/ui/match/rounds/round/round-comment-icon';
export function RoundsResult({ rounds }) {
    return (React.createElement(VirtualListResults, { items: rounds, renderItem: (round) => {
            return (React.createElement(Row, { key: round.id },
                React.createElement(RowLeft, null,
                    React.createElement(MapImage, { mapName: round.mapName }),
                    React.createElement(DotSeparator, null),
                    React.createElement("p", null, round.mapName),
                    React.createElement(DotSeparator, null),
                    React.createElement(RoundNumber, { roundNumber: round.number }),
                    React.createElement(DotSeparator, null),
                    React.createElement(MatchDate, { date: round.date }),
                    round.tagIds.length > 0 && (React.createElement(React.Fragment, null,
                        React.createElement(DotSeparator, null),
                        React.createElement(Tags, { tagIds: round.tagIds }))),
                    round.comment && (React.createElement(React.Fragment, null,
                        React.createElement(DotSeparator, null),
                        React.createElement(RoundCommentIcon, { comment: round.comment })))),
                React.createElement(RowRight, null,
                    React.createElement(WatchButton, { demoPath: round.demoPath, tick: round.startTick - 64 * 5, game: round.game }),
                    React.createElement(SeeRoundLink, { checksum: round.matchChecksum, roundNumber: round.number }),
                    React.createElement(SeeMatchButton, { checksum: round.matchChecksum }))));
        } }));
}
//# sourceMappingURL=rounds-result.js.map