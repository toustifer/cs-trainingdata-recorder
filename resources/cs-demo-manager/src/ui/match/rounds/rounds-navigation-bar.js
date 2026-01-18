import React from 'react';
import { useParams, NavLink } from 'react-router';
import { Trans } from '@lingui/react/macro';
import { useCurrentMatch } from '../use-current-match';
import { buildMatchRoundPath, buildMatchRoundsPath } from 'csdm/ui/routes-paths';
function Link({ children, to, end }) {
    return (React.createElement(NavLink, { className: ({ isActive }) => {
            return `flex flex-col items-center justify-center h-[50px] cursor-pointer border-r border-r-gray-300 ${isActive ? 'bg-gray-200 hover:bg-gray-200' : 'bg-gray-50 hover:bg-gray-100'}`;
        }, to: to, end: end, viewTransition: true },
        React.createElement("div", { className: "flex min-w-40 items-center justify-center px-8" }, children)));
}
export function RoundsNavigationBar() {
    const match = useCurrentMatch();
    const { number, checksum } = useParams();
    if (typeof checksum !== 'string') {
        throw new Error('Missing checksum parameter in url');
    }
    const { rounds } = match;
    let previousRoundUrl;
    let nextRoundUrl;
    if (number) {
        const currentRoundNumber = Number(number);
        previousRoundUrl = buildMatchRoundPath(checksum, Math.max(1, currentRoundNumber - 1));
        nextRoundUrl = buildMatchRoundPath(checksum, Math.min(currentRoundNumber + 1, rounds.length));
    }
    else {
        previousRoundUrl = buildMatchRoundsPath(checksum);
        nextRoundUrl = buildMatchRoundPath(checksum, 1);
    }
    return (React.createElement("div", { className: "mt-auto flex h-[50px] border-t border-t-gray-300" },
        React.createElement(Link, { to: buildMatchRoundsPath(checksum), end: true },
            React.createElement("p", null,
                React.createElement(Trans, null, "Overview"))),
        React.createElement(Link, { to: previousRoundUrl },
            React.createElement("p", { className: "text-body-strong" }, `<`)),
        React.createElement("div", { className: "flex overflow-x-auto overflow-y-hidden" }, rounds.map((round) => {
            return (React.createElement(Link, { key: `round-${round.number}`, to: buildMatchRoundPath(checksum, round.number), end: true }, round.number));
        })),
        React.createElement(Link, { to: nextRoundUrl },
            React.createElement("p", { className: "text-body-strong" }, `>`))));
}
//# sourceMappingURL=rounds-navigation-bar.js.map