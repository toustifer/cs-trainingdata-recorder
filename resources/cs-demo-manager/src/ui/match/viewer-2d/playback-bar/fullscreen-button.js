import React, { useEffect } from 'react';
import { useFullscreen } from '../use-fullscreen';
import { MinimizeIcon } from 'csdm/ui/icons/minimize-icon';
import { MaximizeIcon } from 'csdm/ui/icons/maximize-icon';
import { PlaybackBarButton } from './playback-bar-button';
import { isCtrlOrCmdEvent } from 'csdm/ui/keyboard/keyboard';
export function FullscreenButton() {
    const { isFullscreenEnabled, toggleFullscreen } = useFullscreen();
    useEffect(() => {
        const onKeyDown = (event) => {
            if (isCtrlOrCmdEvent(event)) {
                return;
            }
            if (event.key === 'f') {
                toggleFullscreen();
            }
        };
        window.addEventListener('keydown', onKeyDown);
        return () => {
            window.removeEventListener('keydown', onKeyDown);
        };
    }, [toggleFullscreen]);
    return (React.createElement(PlaybackBarButton, { onClick: toggleFullscreen }, isFullscreenEnabled ? React.createElement(MinimizeIcon, { className: "h-20" }) : React.createElement(MaximizeIcon, { className: "h-20" })));
}
//# sourceMappingURL=fullscreen-button.js.map