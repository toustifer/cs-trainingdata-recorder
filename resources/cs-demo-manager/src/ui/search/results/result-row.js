import React, {} from 'react';
import { Trans } from '@lingui/react/macro';
import { TeamNumber } from 'csdm/common/types/counter-strike';
import { useGetMapThumbnailSrc } from 'csdm/ui/maps/use-get-map-thumbnail-src';
import { CounterTerroristIcon } from 'csdm/ui/icons/counter-terrorist-icon';
import { TerroristIcon } from 'csdm/ui/icons/terrorist-icon';
import { useFormatDate } from 'csdm/ui/hooks/use-format-date';
import { roundNumber } from 'csdm/common/math/round-number';
export function MapImage({ mapName }) {
    const getMapThumbnailSrc = useGetMapThumbnailSrc();
    return React.createElement("img", { className: "h-32", src: getMapThumbnailSrc(mapName) });
}
export function TeamSideIcon({ side }) {
    return (React.createElement("div", null, side === TeamNumber.CT ? React.createElement(CounterTerroristIcon, { className: "h-32" }) : React.createElement(TerroristIcon, { className: "h-32" })));
}
export function PlayerName({ name }) {
    return React.createElement("p", { className: "text-gray-900" }, name);
}
export function RoundNumber({ roundNumber }) {
    return (React.createElement("p", null,
        React.createElement(Trans, null,
            "Round ",
            roundNumber)));
}
export function ActionDuration({ startTick, endTick, tickrate }) {
    let seconds = 0;
    if (endTick > startTick) {
        seconds = roundNumber((endTick - startTick) / tickrate);
    }
    return (React.createElement("p", null,
        React.createElement(Trans, null,
            seconds,
            "s")));
}
export function MatchDate({ date }) {
    const formatDate = useFormatDate();
    return (React.createElement("p", null, formatDate(date, {
        year: 'numeric',
        month: 'numeric',
        day: 'numeric',
    })));
}
export function Row({ children }) {
    return (React.createElement("div", { className: "flex flex-1 items-center justify-between gap-x-8 overflow-x-auto rounded border border-gray-300 bg-gray-75 px-16 py-8 scrollbar-stable" }, children));
}
export function RowLeft({ children }) {
    return React.createElement("div", { className: "flex flex-none items-center gap-x-8" }, children);
}
export function RowRight({ children }) {
    return React.createElement("div", { className: "flex items-center gap-x-8" }, children);
}
//# sourceMappingURL=result-row.js.map