import React from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { InputLabel } from 'csdm/ui/components/inputs/input-label';
import { HeatmapEvent } from 'csdm/common/types/heatmap-event';
import { Select } from 'csdm/ui/components/inputs/select';
export function HeatmapSelectEvent({ event, onChange }) {
    const { t } = useLingui();
    const eventMessage = {
        [HeatmapEvent.Kills]: t({
            context: 'Heatmap event',
            message: 'Kills',
        }),
        [HeatmapEvent.Deaths]: t({
            context: 'Heatmap event',
            message: 'Deaths',
        }),
        [HeatmapEvent.Shots]: t({
            context: 'Heatmap event',
            message: 'Shots',
        }),
        [HeatmapEvent.HeGrenade]: t({
            context: 'Heatmap event',
            message: 'HE',
        }),
        [HeatmapEvent.Flashbang]: t({
            context: 'Heatmap event',
            message: 'Flashbang',
        }),
        [HeatmapEvent.Smoke]: t({
            context: 'Heatmap event',
            message: 'Smoke',
        }),
        [HeatmapEvent.Molotov]: t({
            context: 'Heatmap event',
            message: 'Molotov',
        }),
        [HeatmapEvent.Decoy]: t({
            context: 'Heatmap event',
            message: 'Decoy',
        }),
    };
    const options = Object.values(HeatmapEvent).map((event) => {
        return {
            label: eventMessage[event],
            value: event,
        };
    });
    return (React.createElement("div", { className: "flex flex-col gap-y-8" },
        React.createElement(InputLabel, null,
            React.createElement(Trans, { context: "Input label" }, "Event")),
        React.createElement(Select, { onChange: onChange, value: event, options: options })));
}
//# sourceMappingURL=heatmap-select-event.js.map