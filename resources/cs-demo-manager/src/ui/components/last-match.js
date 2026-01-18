import React from 'react';
import clsx from 'clsx';
import { useNavigateToMatch } from 'csdm/ui/hooks/use-navigate-to-match';
import { useFormatDate } from 'csdm/ui/hooks/use-format-date';
import { useGetMapThumbnailSrc } from 'csdm/ui/maps/use-get-map-thumbnail-src';
export function LastMatch({ match }) {
    const formatDate = useFormatDate();
    const getMapThumbnailSrc = useGetMapThumbnailSrc();
    const navigateToMatch = useNavigateToMatch();
    const onClick = () => {
        navigateToMatch(match.checksum);
    };
    const isTieGame = match.winnerName === '';
    const hasPlayerWon = match.winnerName === match.focusTeamName;
    return (React.createElement("div", { className: "flex min-w-fit cursor-pointer items-center gap-x-4", onClick: onClick },
        React.createElement("img", { className: "w-[128px]", src: getMapThumbnailSrc(match.mapName, match.game) }),
        React.createElement("div", { className: "flex flex-col" },
            React.createElement("p", null, formatDate(match.date, {
                hour: undefined,
                minute: undefined,
                second: undefined,
            })),
            React.createElement("p", null, match.mapName),
            React.createElement("div", { className: clsx('flex justify-center', isTieGame ? 'text-blue-400' : hasPlayerWon ? 'text-green-400' : 'text-red-400') },
                React.createElement("p", null, match.scoreTeamA),
                React.createElement("p", null, ":"),
                React.createElement("p", null, match.scoreTeamB)))));
}
//# sourceMappingURL=last-match.js.map