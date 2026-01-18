import React from 'react';
import { useVideoSettings } from 'csdm/ui/settings/video/use-video-settings';
import { GameWidthInput } from 'csdm/ui/settings/shared/game-width-input';
export function RecordingGameWidth() {
    const { settings, updateSettings } = useVideoSettings();
    const onBlur = (width) => {
        if (!width) {
            return;
        }
        updateSettings({
            width,
        });
    };
    return React.createElement(GameWidthInput, { width: settings.width, onBlur: onBlur });
}
//# sourceMappingURL=recording-game-width.js.map