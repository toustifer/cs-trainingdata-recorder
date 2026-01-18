import React from 'react';
import { Content } from 'csdm/ui/components/content';
import { roundNumber } from 'csdm/common/math/round-number';
import { Message } from 'csdm/ui/components/message';
import { WinRate } from 'csdm/ui/components/panels/win-rate';
import { useGetMapThumbnailSrc } from 'csdm/ui/maps/use-get-map-thumbnail-src';
import { Panel, PanelStatRow } from 'csdm/ui/components/panel';
import { CounterTerroristIcon } from 'csdm/ui/icons/counter-terrorist-icon';
import { TerroristIcon } from 'csdm/ui/icons/terrorist-icon';
import { Trans } from '@lingui/react/macro';
function MapEntry({ mapStats }) {
    const getMapThumbnailSrc = useGetMapThumbnailSrc();
    return (React.createElement("div", { className: "flex gap-x-12 py-12 first:pt-0" },
        React.createElement("div", { className: "flex flex-col self-center" },
            React.createElement("img", { className: "max-w-[200px] rounded-4", src: getMapThumbnailSrc(mapStats.mapName), alt: mapStats.mapName }),
            React.createElement("p", { className: "selectable text-center" }, mapStats.mapName)),
        React.createElement(Panel, { header: React.createElement(Trans, { context: "Panel title" }, "Matches"), minWidth: 200 },
            React.createElement(PanelStatRow, { title: React.createElement(Trans, null, "Total"), value: mapStats.matchCount }),
            React.createElement(PanelStatRow, { title: React.createElement(Trans, null, "Win"), value: mapStats.winCount }),
            React.createElement(PanelStatRow, { title: React.createElement(Trans, null, "Lost"), value: mapStats.lostCount }),
            React.createElement(PanelStatRow, { title: React.createElement(Trans, null, "Tie"), value: mapStats.tiedCount }),
            React.createElement(WinRate, { value: roundNumber((mapStats.winCount / mapStats.matchCount) * 100, 1) })),
        React.createElement(Panel, { header: React.createElement(Trans, { context: "Panel title" }, "Rounds"), minWidth: 200 },
            React.createElement(PanelStatRow, { title: React.createElement(Trans, null, "Total"), value: mapStats.roundCount }),
            React.createElement(PanelStatRow, { title: React.createElement(Trans, null, "Win"), value: mapStats.roundWinCount }),
            React.createElement(PanelStatRow, { title: React.createElement(Trans, null, "Lost"), value: mapStats.roundLostCount }),
            React.createElement(WinRate, { value: roundNumber((mapStats.roundWinCount / mapStats.roundCount) * 100, 1) })),
        React.createElement(Panel, { header: React.createElement(Trans, { context: "Panel title" }, "Sides"), minWidth: 200 },
            React.createElement("div", { className: "flex flex-col gap-y-4" },
                React.createElement("div", { className: "flex items-center gap-x-4" },
                    React.createElement(CounterTerroristIcon, { width: 32 }),
                    React.createElement(WinRate, { value: roundNumber((mapStats.roundWinCountAsCt / mapStats.roundCountAsCt) * 100, 1), barClassName: "bg-ct" })),
                React.createElement("div", { className: "flex items-center gap-x-4" },
                    React.createElement(TerroristIcon, { width: 32 }),
                    React.createElement(WinRate, { value: roundNumber((mapStats.roundWinCountAsT / mapStats.roundCountAsT) * 100, 1), barClassName: "bg-terro" })))),
        React.createElement(Panel, { header: React.createElement(Trans, { context: "Panel title" }, "Impact") },
            React.createElement(PanelStatRow, { title: React.createElement(Trans, null, "K/D"), value: roundNumber(mapStats.killDeathRatio, 2) }),
            React.createElement(PanelStatRow, { title: React.createElement(Trans, null, "ADR"), value: roundNumber(mapStats.averageDamagesPerRound, 1) }),
            React.createElement(PanelStatRow, { title: React.createElement(Trans, null, "KAST"), value: roundNumber(mapStats.kast, 1) }),
            React.createElement(PanelStatRow, { title: React.createElement(Trans, null, "HS%"), value: roundNumber(mapStats.headshotPercentage, 1) }))));
}
export function MapsStats({ mapsStats }) {
    if (mapsStats.length === 0) {
        return React.createElement(Message, { message: React.createElement(Trans, null, "No maps stats found.") });
    }
    return (React.createElement(Content, null,
        React.createElement("div", { className: "flex flex-col divide-y divide-gray-300" }, mapsStats.map((mapStats) => {
            return React.createElement(MapEntry, { key: mapStats.mapName, mapStats: mapStats });
        }))));
}
//# sourceMappingURL=maps-stats.js.map