import React from 'react';
import { Trans } from '@lingui/react/macro';
import { MapIcon } from 'csdm/ui/icons/map-icon';
import { useViewerContext } from '../use-viewer-context';
import { PlaybackBarButton } from './playback-bar-button';
import { OpacityInput } from 'csdm/ui/components/inputs/opacity-input';
import { Popover, PopoverContent, PopoverTrigger } from 'csdm/ui/components/popover/popover';
import { RangeInput } from 'csdm/ui/components/inputs/range-input';
import { ResetButton } from 'csdm/ui/components/buttons/reset-button';
function LowerRadarPopover({ radarSize }) {
    const { lowerRadarOffsetX, setLowerRadarOffsetX, lowerRadarOffsetY, setLowerRadarOffsetY, lowerRadarOpacity, setLowerRadarOpacity, } = useViewerContext();
    return (React.createElement("div", { className: "flex flex-col gap-y-8 rounded-8 bg-gray-100 p-8" },
        React.createElement("p", { className: "text-body-strong" },
            React.createElement(Trans, null, "Lower radar configuration")),
        React.createElement(RangeInput, { label: React.createElement(Trans, { context: "Input label" }, "X"), value: lowerRadarOffsetX, onChange: setLowerRadarOffsetX, min: -radarSize, max: radarSize }),
        React.createElement(RangeInput, { label: React.createElement(Trans, { context: "Input label" }, "Y"), value: lowerRadarOffsetY, onChange: setLowerRadarOffsetY, min: -radarSize * 2, max: 0 }),
        React.createElement(OpacityInput, { value: lowerRadarOpacity, onChange: setLowerRadarOpacity }),
        React.createElement("div", null,
            React.createElement(ResetButton, { onClick: () => {
                    setLowerRadarOffsetX(0);
                    setLowerRadarOffsetY(0);
                    setLowerRadarOpacity(1);
                } }))));
}
export function LowerRadarButton() {
    const { map } = useViewerContext();
    if (map.lowerRadarFilePath === undefined) {
        return null;
    }
    return (React.createElement(Popover, { openOnHover: true, closeDelay: 300 },
        React.createElement(PopoverTrigger, { asChild: true },
            React.createElement(PlaybackBarButton, null,
                React.createElement(MapIcon, { className: "w-20" }))),
        React.createElement(PopoverContent, null,
            React.createElement(LowerRadarPopover, { radarSize: map.radarSize }))));
}
//# sourceMappingURL=lower-radar-button.js.map