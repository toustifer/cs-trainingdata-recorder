import React from 'react';
import { Trans } from '@lingui/react/macro';
import { WatchButton } from 'csdm/ui/components/buttons/watch-button';
import { VirtualListResults } from './virtual-list-results';
import { DotSeparator } from './dot-separator';
import { SeeMatchButton } from 'csdm/ui/components/buttons/see-match-button';
import { MapImage, MatchDate, PlayerName, RoundNumber, Row, RowLeft, RowRight } from './result-row';
import { SeeRoundLink } from 'csdm/ui/components/links/see-round-link';
import { RoundCommentIcon } from 'csdm/ui/match/rounds/round/round-comment-icon';
export function NinjaDefuseResults({ bombsDefused }) {
    return (React.createElement(VirtualListResults, { items: bombsDefused, renderItem: (bombDefused) => {
            const ctAliveCount = bombDefused.ctAliveCount;
            const tAliveCount = bombDefused.tAliveCount;
            return (React.createElement(Row, { key: bombDefused.id },
                React.createElement(RowLeft, null,
                    React.createElement(MapImage, { mapName: bombDefused.mapName }),
                    React.createElement(PlayerName, { name: bombDefused.defuserName }),
                    React.createElement(DotSeparator, null),
                    React.createElement("p", null, bombDefused.mapName),
                    React.createElement(DotSeparator, null),
                    React.createElement(RoundNumber, { roundNumber: bombDefused.roundNumber }),
                    React.createElement(DotSeparator, null),
                    React.createElement("p", null,
                        React.createElement(Trans, null,
                            "CT ",
                            ctAliveCount)),
                    React.createElement(DotSeparator, null),
                    React.createElement("p", null,
                        React.createElement(Trans, null,
                            "T ",
                            tAliveCount)),
                    React.createElement(DotSeparator, null),
                    React.createElement(MatchDate, { date: bombDefused.date }),
                    bombDefused.roundComment && (React.createElement(React.Fragment, null,
                        React.createElement(DotSeparator, null),
                        React.createElement(RoundCommentIcon, { comment: bombDefused.roundComment })))),
                React.createElement(RowRight, null,
                    React.createElement(WatchButton, { demoPath: bombDefused.demoPath, tick: bombDefused.tick - 64 * 20, focusSteamId: bombDefused.defuserSteamId, game: bombDefused.game }),
                    React.createElement(SeeRoundLink, { checksum: bombDefused.matchChecksum, roundNumber: bombDefused.roundNumber }),
                    React.createElement(SeeMatchButton, { checksum: bombDefused.matchChecksum }))));
        } }));
}
//# sourceMappingURL=ninja-defuse-results.js.map