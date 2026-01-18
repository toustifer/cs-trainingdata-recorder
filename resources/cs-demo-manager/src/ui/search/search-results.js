import React from 'react';
import { Trans } from '@lingui/react/macro';
import { useSearchState } from './use-search-state';
import { Status } from 'csdm/common/types/status';
import { Message } from 'csdm/ui/components/message';
import { SearchEvent } from 'csdm/common/types/search/search-event';
import { MultiKillsResults } from './results/multi-kills-results';
import { ClutchesResults } from './results/clutches-results';
import { assertNever } from 'csdm/common/assert-never';
import { KillsResults } from './results/kills-results';
import { NinjaDefuseResults } from './results/ninja-defuse-results';
import { useMatchChecksums } from 'csdm/ui/cache/use-match-checksums';
import { RoundsResult } from './results/rounds-result';
export function SearchResults() {
    const { status, result, event } = useSearchState();
    const matchChecksums = useMatchChecksums();
    if (matchChecksums.length === 0) {
        return React.createElement(Message, { message: React.createElement(Trans, null, "You have to analyze demos first to search for events.") });
    }
    if (status === Status.Idle) {
        return React.createElement(Message, { message: React.createElement(Trans, null, "Click on the search button to reveal events.") });
    }
    if (status === Status.Loading) {
        return React.createElement(Message, { message: React.createElement(Trans, null, "Searching\u2026") });
    }
    if (status === Status.Error) {
        return React.createElement(Message, { message: React.createElement(Trans, null, "An error occurred.") });
    }
    if (status === Status.Success && result.length === 0) {
        return React.createElement(Message, { message: React.createElement(Trans, null, "No results found.") });
    }
    switch (event) {
        case SearchEvent.FiveKill:
        case SearchEvent.FourKill:
            return React.createElement(MultiKillsResults, { multiKills: result });
        case SearchEvent.OneVsFive:
        case SearchEvent.OneVsFour:
        case SearchEvent.OneVsThree:
            return React.createElement(ClutchesResults, { clutches: result });
        case SearchEvent.Kills:
            return React.createElement(KillsResults, { kills: result });
        case SearchEvent.NinjaDefuse:
            return React.createElement(NinjaDefuseResults, { bombsDefused: result });
        case SearchEvent.RoundStart:
            return React.createElement(RoundsResult, { rounds: result });
        default:
            return assertNever(event, 'Unknown search type');
    }
}
//# sourceMappingURL=search-results.js.map