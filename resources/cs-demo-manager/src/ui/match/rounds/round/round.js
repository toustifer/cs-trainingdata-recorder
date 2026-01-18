import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router';
import { buildMatchRoundPath, buildMatchRoundsPath } from 'csdm/ui/routes-paths';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { RoundTopBar } from './round-top-bar';
import { KillFeed } from './kill-feed';
import { Clutches } from './clutches';
import { EndReason } from './end-reason';
import { PlayersInformation } from './players-information';
import { Content } from 'csdm/ui/components/content';
import { RoundsNavigationBar } from '../rounds-navigation-bar';
import { PlayersEconomyChart } from './players-economy-chart';
import { RoundTags } from './round-tags';
import { Message } from 'csdm/ui/components/message';
import { Trans } from '@lingui/react/macro';
import { RoundCommentInput } from './round-comment-input';
export function Round() {
    const match = useCurrentMatch();
    const params = useParams();
    const matchChecksum = params.checksum;
    const roundNumber = Number.parseInt(params.number);
    const navigate = useNavigate();
    useEffect(() => {
        const onKeyDown = (event) => {
            if (event.key === 'ArrowRight' && match.rounds.length > roundNumber) {
                navigate(buildMatchRoundPath(matchChecksum, roundNumber + 1));
            }
            else if (event.key === 'ArrowLeft') {
                if (roundNumber > 1) {
                    navigate(buildMatchRoundPath(matchChecksum, roundNumber - 1));
                }
                else {
                    navigate(buildMatchRoundsPath(matchChecksum));
                }
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    });
    const round = match.rounds.find((round) => round.number === roundNumber);
    if (!round) {
        return React.createElement(Message, { message: React.createElement(Trans, null,
                "Round number ",
                roundNumber,
                " not found.") });
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(RoundTopBar, null),
        React.createElement(Content, null,
            React.createElement("div", { className: "flex gap-8" },
                React.createElement(KillFeed, null),
                React.createElement(Clutches, null),
                React.createElement(EndReason, null),
                React.createElement(RoundTags, null),
                React.createElement("div", { className: "max-h-[250px] w-full max-w-[512px]" },
                    React.createElement(RoundCommentInput, { checksum: round.matchChecksum, number: round.number, comment: round.comment }))),
            React.createElement("div", { className: "mt-12" },
                React.createElement(PlayersEconomyChart, null)),
            React.createElement("div", { className: "mt-12" },
                React.createElement(PlayersInformation, null))),
        React.createElement(RoundsNavigationBar, null)));
}
//# sourceMappingURL=round.js.map