import React from 'react';
import { useLocation, useParams } from 'react-router';
import { Trans } from '@lingui/react/macro';
import { TabLinks } from 'csdm/ui/components/tabs/tab-links';
import { TabLink } from 'csdm/ui/components/tabs/tab-link';
import { buildMatchPath, RoutePath } from 'csdm/ui/routes-paths';
import { NextLink, PreviousLink } from 'csdm/ui/components/links';
import { useCurrentMatch } from './use-current-match';
import { isCounterStrikeStartable } from 'csdm/ui/hooks/use-counter-strike';
import { useCurrentMatchSequences } from 'csdm/ui/match/video/sequences/use-current-match-sequences';
import { TabLinkNumberBadge } from 'csdm/ui/components/tabs/tab-link-number-badge';
import { modifierKey } from '../keyboard/keyboard-shortcut';
function PreviousMatchLink() {
    const location = useLocation();
    const siblingChecksums = location.state?.siblingChecksums ?? [];
    const { checksum: currentChecksum } = useParams();
    const currentMatchIndex = siblingChecksums?.findIndex((checksum) => checksum === currentChecksum);
    const previousMatchChecksum = siblingChecksums[currentMatchIndex - 1];
    const to = previousMatchChecksum === undefined ? '' : buildMatchPath(previousMatchChecksum);
    const shortcut = `${modifierKey}+←`;
    return React.createElement(PreviousLink, { to: to, tooltip: React.createElement(Trans, null,
            "Previous match (",
            shortcut,
            ")") });
}
function NextMatchLink() {
    const { checksum: currentChecksum } = useParams();
    const location = useLocation();
    const siblingChecksums = location.state?.siblingChecksums ?? [];
    const currentMatchIndex = siblingChecksums?.findIndex((checksum) => checksum === currentChecksum);
    const nextMatchChecksum = siblingChecksums[currentMatchIndex + 1];
    const to = nextMatchChecksum === undefined ? '' : buildMatchPath(nextMatchChecksum);
    const shortcut = `${modifierKey}+→`;
    return React.createElement(NextLink, { to: to, tooltip: React.createElement(Trans, null,
            "Next match (",
            shortcut,
            ")") });
}
export function MatchTabs() {
    const match = useCurrentMatch();
    const sequences = useCurrentMatchSequences();
    return (React.createElement(TabLinks, null,
        React.createElement(PreviousMatchLink, null),
        React.createElement(TabLink, { url: "" },
            React.createElement(Trans, { context: "Tab link" }, "Overview")),
        React.createElement(TabLink, { url: RoutePath.MatchRounds, end: false },
            React.createElement(Trans, { context: "Tab link" }, "Rounds")),
        React.createElement(TabLink, { url: RoutePath.MatchPlayers, end: false },
            React.createElement(Trans, { context: "Tab link" }, "Players")),
        React.createElement(TabLink, { url: RoutePath.MatchHeatmap },
            React.createElement(Trans, { context: "Tab link" }, "Heatmap")),
        React.createElement(TabLink, { url: RoutePath.MatchWeapons },
            React.createElement(Trans, { context: "Tab link" }, "Weapons")),
        React.createElement(TabLink, { url: RoutePath.MatchDuels, end: false },
            React.createElement(Trans, { context: "Tab link" }, "Duels")),
        React.createElement(TabLink, { url: RoutePath.MatchGrenades, end: false },
            React.createElement(Trans, { context: "Tab link" }, "Grenades")),
        React.createElement(TabLink, { url: RoutePath.MatchEconomy },
            React.createElement(Trans, { context: "Tab link" }, "Economy")),
        React.createElement(TabLink, { url: RoutePath.Match2dViewer, end: false },
            React.createElement(Trans, { context: "Tab link" }, "2D viewer")),
        isCounterStrikeStartable(match.game) && (React.createElement("div", { className: "relative" },
            React.createElement(TabLink, { url: RoutePath.MatchVideo },
                React.createElement(Trans, { context: "Tab link" }, "Video")),
            React.createElement(TabLinkNumberBadge, { number: sequences.length }))),
        React.createElement(TabLink, { url: RoutePath.MatchChat },
            React.createElement(Trans, { context: "Tab link" }, "Chat")),
        React.createElement(NextMatchLink, null)));
}
//# sourceMappingURL=match-tabs.js.map