import React, { useEffect, useState } from 'react';
import { useViewerContext } from '../use-viewer-context';
import { PlaybackBarButton } from './playback-bar-button';
import { VerticalSlider } from './vertical-slider';
import { isCtrlOrCmdEvent } from 'csdm/ui/keyboard/keyboard';
import { Popover, PopoverContent, PopoverTrigger } from 'csdm/ui/components/popover/popover';
export function SpeedButton() {
    const [isSliderVisible, setIsSliderVisible] = useState(false);
    const { speed, setSpeed } = useViewerContext();
    const min = 0.5;
    const max = 4;
    const interval = 0.5;
    useEffect(() => {
        const onKeyDown = (event) => {
            if (isCtrlOrCmdEvent(event)) {
                return;
            }
            if (event.key === 'ArrowRight') {
                setSpeed(Math.min(speed + interval, max));
            }
            else if (event.key === 'ArrowLeft') {
                setSpeed(Math.max(speed - interval, min));
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [setSpeed, speed]);
    return (React.createElement(Popover, { open: isSliderVisible, onOpenChange: setIsSliderVisible, openOnHover: true },
        React.createElement(PopoverTrigger, { asChild: true },
            React.createElement(PlaybackBarButton, { onClick: () => {
                    setIsSliderVisible(!isSliderVisible);
                } },
                React.createElement("p", null, `${speed}x`))),
        React.createElement(PopoverContent, null,
            React.createElement(VerticalSlider, { min: min, max: max, step: interval, value: speed, onChange: (event) => {
                    setSpeed(+event.target.value);
                } }))));
}
//# sourceMappingURL=speed-button.js.map