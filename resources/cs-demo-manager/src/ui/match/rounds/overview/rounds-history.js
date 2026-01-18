import React from 'react';
import { useLingui } from '@lingui/react/macro';
import { RoundEndReasonIcon } from 'csdm/ui/icons/round-end-reason-icon';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { TagIndicator } from 'csdm/ui/components/tags/tag-indicator';
import { useTags } from 'csdm/ui/tags/use-tags';
function Tags({ tagIds }) {
    const maxVisibleTagCount = 9;
    const allTags = useTags();
    const tags = allTags
        .filter((tag) => {
        return tagIds.includes(tag.id);
    })
        .slice(0, maxVisibleTagCount);
    return (React.createElement("div", { className: "flex flex-wrap gap-4 px-4" }, tags.map((tag) => {
        return React.createElement(TagIndicator, { key: tag.id, tag: tag });
    })));
}
function Cell({ children }) {
    return (React.createElement("div", { className: "flex items-center justify-center bg-gray-50" },
        React.createElement("span", null, children)));
}
function TitleCell({ title }) {
    return (React.createElement(Cell, null,
        React.createElement("p", { className: "mr-auto max-w-[248px] truncate px-8", title: title }, title)));
}
export function RoundsHistory() {
    const { teamA, teamB, rounds } = useCurrentMatch();
    const { t } = useLingui();
    return (React.createElement("div", { className: "mb-12 grid max-w-fit flex-none grid-flow-col grid-rows-[30px_repeat(3,35px)] gap-px overflow-x-auto border border-gray-300 bg-gray-300", style: {
            gridTemplateColumns: `auto repeat(${rounds.length}, 40px)`,
        } },
        React.createElement(TitleCell, { title: t `Round` }),
        React.createElement(TitleCell, { title: teamA.name }),
        React.createElement(TitleCell, { title: teamB.name }),
        React.createElement(TitleCell, { title: t `Tags` }),
        rounds.map((round) => {
            return (React.createElement(React.Fragment, { key: `round-${round.number}` },
                React.createElement(Cell, null, round.number),
                React.createElement(Cell, null, round.winnerTeamName === teamA.name && React.createElement(RoundEndReasonIcon, { round: round })),
                React.createElement(Cell, null, round.winnerTeamName === teamB.name && React.createElement(RoundEndReasonIcon, { round: round })),
                React.createElement(Cell, null,
                    React.createElement(Tags, { tagIds: round.tagIds }))));
        })));
}
//# sourceMappingURL=rounds-history.js.map