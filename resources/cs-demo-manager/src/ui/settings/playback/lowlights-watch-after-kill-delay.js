import React from 'react';
import { Trans } from '@lingui/react/macro';
import { WatchBeforeKillDelay } from './watch-before-kill-delay';
import { usePlaybackSettings } from './use-playback-settings';
export function LowlightsWatchAfterKillDelay() {
    const { lowlights, updateSettings } = usePlaybackSettings();
    const onChange = async (seconds) => {
        await updateSettings({
            lowlights: {
                afterKillDelayInSeconds: seconds,
            },
        });
    };
    return (React.createElement(WatchBeforeKillDelay, { title: React.createElement(Trans, { context: "Settings title" }, "After kill delay (lowlights)"), description: React.createElement(Trans, null, "How many seconds to wait before skipping to the next kill when watching lowlights"), defaultValue: lowlights.afterKillDelayInSeconds, onChange: onChange }));
}
//# sourceMappingURL=lowlights-watch-after-kill-delay.js.map