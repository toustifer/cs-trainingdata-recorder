import React, { useEffect } from 'react';
import { Trans } from '@lingui/react/macro';
import { useNavigate, useParams } from 'react-router';
import { buildMatchRoundPath } from 'csdm/ui/routes-paths';
import { Content } from 'csdm/ui/components/content';
import { useCurrentMatch } from '../../use-current-match';
import { RoundsNavigationBar } from '../rounds-navigation-bar';
import { RoundsEntries } from './rounds-entries';
import { RoundsHistory } from './rounds-history';
import { Message } from 'csdm/ui/components/message';
export function Rounds() {
    const match = useCurrentMatch();
    const { checksum } = useParams();
    const navigate = useNavigate();
    useEffect(() => {
        const onKeyDown = (event) => {
            const { rounds } = match;
            if (event.key === 'ArrowRight' && rounds.length > 1) {
                navigate(buildMatchRoundPath(checksum, 1));
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    });
    if (match.rounds.length === 0) {
        return React.createElement(Message, { message: React.createElement(Trans, null, "No rounds found.") });
    }
    return (React.createElement(React.Fragment, null,
        React.createElement(Content, null,
            React.createElement(RoundsHistory, null),
            React.createElement(RoundsEntries, null)),
        React.createElement(RoundsNavigationBar, null)));
}
//# sourceMappingURL=rounds.js.map