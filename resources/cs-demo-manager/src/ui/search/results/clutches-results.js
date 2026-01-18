import React from 'react';
import { WatchButton } from '../../components/buttons/watch-button';
import { VirtualListResults } from './virtual-list-results';
import { DotSeparator } from './dot-separator';
import { MapImage, MatchDate, PlayerName, RoundNumber, Row, RowLeft, RowRight, TeamSideIcon } from './result-row';
import { SeeMatchButton } from 'csdm/ui/components/buttons/see-match-button';
import { SeeRoundLink } from 'csdm/ui/components/links/see-round-link';
import { RoundCommentIcon } from 'csdm/ui/match/rounds/round/round-comment-icon';
export function ClutchesResults({ clutches }) {
    return (React.createElement(VirtualListResults, { items: clutches, renderItem: (clutch) => {
            return (React.createElement(Row, { key: clutch.id },
                React.createElement(RowLeft, null,
                    React.createElement(MapImage, { mapName: clutch.mapName }),
                    React.createElement(TeamSideIcon, { side: clutch.side }),
                    React.createElement(PlayerName, { name: clutch.clutcherName }),
                    React.createElement(DotSeparator, null),
                    React.createElement("p", null, clutch.mapName),
                    React.createElement(DotSeparator, null),
                    React.createElement(RoundNumber, { roundNumber: clutch.roundNumber }),
                    React.createElement(DotSeparator, null),
                    React.createElement(MatchDate, { date: clutch.date }),
                    clutch.roundComment && (React.createElement(React.Fragment, null,
                        React.createElement(DotSeparator, null),
                        React.createElement(RoundCommentIcon, { comment: clutch.roundComment })))),
                React.createElement(RowRight, null,
                    React.createElement(WatchButton, { demoPath: clutch.demoPath, game: clutch.game, tick: clutch.tick - 64 * 5, focusSteamId: clutch.clutcherSteamId }),
                    React.createElement(SeeRoundLink, { checksum: clutch.matchChecksum, roundNumber: clutch.roundNumber }),
                    React.createElement(SeeMatchButton, { checksum: clutch.matchChecksum }))));
        } }));
}
//# sourceMappingURL=clutches-results.js.map