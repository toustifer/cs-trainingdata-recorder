import React from 'react';
import { WatchBeforeKillDelay } from './watch-before-kill-delay';
import { Trans } from '@lingui/react/macro';
import { usePlaybackSettings } from './use-playback-settings';
export function LowlightsWatchBeforeKillDelay() {
    const { lowlights, updateSettings } = usePlaybackSettings();
    const onChange = async (seconds) => {
        await updateSettings({
            lowlights: {
                beforeKillDelayInSeconds: seconds,
            },
        });
    };
    return (React.createElement(WatchBeforeKillDelay, { title: React.createElement(Trans, { context: "Settings title" }, "Before kill delay (lowlights)"), description: React.createElement(Trans, null, "How many seconds to start before a kill when watching lowlights"), defaultValue: lowlights.beforeKillDelayInSeconds, onChange: onChange }));
}
//# sourceMappingURL=lowlights-watch-before-kill-delay.js.map