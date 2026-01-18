import React from 'react';
import clsx from 'clsx';
import { MatchScore } from 'csdm/ui/downloads/sidebar/match-score';
import { MatchDate } from 'csdm/ui/downloads/sidebar/match-date';
import { MatchResultText } from './match-result-text';
import { MatchResult } from 'csdm/ui/downloads/match-result';
import { MatchDownloadStatus } from './match-download-status';
import { useGetMapThumbnailSrc } from 'csdm/ui/maps/use-get-map-thumbnail-src';
import { useSecondsToFormattedMinutes } from 'csdm/ui/hooks/use-seconds-to-formatted-minutes';
export function MatchEntry({ mapName, scoreOnTheLeft, scoreOnTheRight, sideOnTheLeft, sideOnTheRight, isSelected, selectMatch, result, downloadStatus, date, duration, game, }) {
    const getMapThumbnailSrc = useGetMapThumbnailSrc();
    const secondsToFormattedMinutes = useSecondsToFormattedMinutes();
    const borderLeftClasses = {
        [MatchResult.Defeat]: 'border-l-red-700',
        [MatchResult.Victory]: 'border-l-green-400',
        [MatchResult.Tied]: 'border-l-blue-400',
        [MatchResult.Unplayed]: 'border-l-gray-800',
    };
    return (React.createElement("div", { className: clsx('flex cursor-pointer items-center border-b border-l-2 border-b-gray-300 p-8', isSelected ? 'bg-gray-100' : 'bg-gray-50 hover:bg-gray-75', borderLeftClasses[result]), onClick: selectMatch },
        React.createElement("div", { className: "flex flex-col items-center" },
            React.createElement("img", { className: "h-[64px] w-[128px]", src: getMapThumbnailSrc(mapName, game), alt: mapName }),
            React.createElement("p", null, mapName)),
        React.createElement("div", { className: "flex flex-col items-center pl-8" },
            React.createElement("div", { className: "flex w-full items-center justify-around" },
                React.createElement(MatchScore, { teamNumber: sideOnTheLeft, score: scoreOnTheLeft }),
                React.createElement("p", { className: "text-body-strong" }, "-"),
                React.createElement(MatchScore, { teamNumber: sideOnTheRight, score: scoreOnTheRight })),
            React.createElement("div", { className: "text-caption" },
                React.createElement(MatchDate, { date: date }),
                React.createElement("p", null, secondsToFormattedMinutes(duration))),
            React.createElement(MatchResultText, { result: result }),
            downloadStatus !== undefined && React.createElement(MatchDownloadStatus, { status: downloadStatus }))));
}
//# sourceMappingURL=match-entry.js.map