import React from 'react';
import { Trans } from '@lingui/react/macro';
import { WatchBeforeKillDelay } from './watch-before-kill-delay';
import { usePlaybackSettings } from './use-playback-settings';
export function HighlightsWatchAfterKillDelay() {
    const { highlights, updateSettings } = usePlaybackSettings();
    const onChange = async (seconds) => {
        await updateSettings({
            highlights: {
                afterKillDelayInSeconds: seconds,
            },
        });
    };
    return (React.createElement(WatchBeforeKillDelay, { title: React.createElement(Trans, { context: "Settings title" }, "After kill delay (highlights)"), description: React.createElement(Trans, null, "How many seconds to wait before skipping to the next kill when watching highlights"), defaultValue: highlights.afterKillDelayInSeconds, onChange: onChange }));
}
//# sourceMappingURL=highlights-watch-after-kill-delay.js.map