import React from 'react';
import { GameWidthInput } from 'csdm/ui/settings/shared/game-width-input';
import { usePlaybackSettings } from './use-playback-settings';
export function GameWidth() {
    const { width, updateSettings } = usePlaybackSettings();
    const onBlur = async (width) => {
        if (!width) {
            return;
        }
        await updateSettings({
            width,
        });
    };
    return React.createElement(GameWidthInput, { width: width, onBlur: onBlur });
}
//# sourceMappingURL=game-width.js.map