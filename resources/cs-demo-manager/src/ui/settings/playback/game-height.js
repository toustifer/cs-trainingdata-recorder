import React from 'react';
import { GameHeightInput } from 'csdm/ui/settings/shared/game-height-input';
import { usePlaybackSettings } from './use-playback-settings';
export function GameHeight() {
    const { height, updateSettings } = usePlaybackSettings();
    const onBlur = async (height) => {
        if (!height) {
            return;
        }
        await updateSettings({
            height,
        });
    };
    return React.createElement(GameHeightInput, { height: height, onBlur: onBlur });
}
//# sourceMappingURL=game-height.js.map