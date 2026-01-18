import React from 'react';
import { useVideoSettings } from 'csdm/ui/settings/video/use-video-settings';
import { GameHeightInput } from 'csdm/ui/settings/shared/game-height-input';
export function RecordingGameHeight() {
    const { settings, updateSettings } = useVideoSettings();
    const onBlur = (height) => {
        if (!height) {
            return;
        }
        updateSettings({
            height,
        });
    };
    return React.createElement(GameHeightInput, { height: settings.height, onBlur: onBlur });
}
//# sourceMappingURL=recording-game-height.js.map