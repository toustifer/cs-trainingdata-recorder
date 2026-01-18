import React from 'react';
import { DownloadActions } from './download-actions';
import { useSecondsToFormattedMinutes } from 'csdm/ui/hooks/use-seconds-to-formatted-minutes';
import { useFormatDate } from 'csdm/ui/hooks/use-format-date';
import { useGetMapThumbnailSrc } from 'csdm/ui/maps/use-get-map-thumbnail-src';
export function DownloadEntry({ download }) {
    const { mapName, durationInSeconds, date } = download.match;
    const getMapThumbnailSrc = useGetMapThumbnailSrc();
    const secondsToFormattedMinutes = useSecondsToFormattedMinutes();
    const formatDate = useFormatDate();
    return (React.createElement("div", { className: "mx-auto flex w-[800px] border-b border-b-gray-300 py-8" },
        React.createElement("img", { className: "mr-4 w-[128px]", src: getMapThumbnailSrc(mapName, download.game), alt: mapName }),
        React.createElement("div", { className: "flex flex-col justify-between" },
            React.createElement("p", { className: "selectable text-body-strong" }, mapName),
            React.createElement("div", null,
                React.createElement("p", { className: "selectable" }, secondsToFormattedMinutes(durationInSeconds)),
                React.createElement("p", { className: "selectable" }, formatDate(date)))),
        React.createElement(DownloadActions, { demoFileName: download.fileName, matchId: download.matchId })));
}
//# sourceMappingURL=download-entry.js.map