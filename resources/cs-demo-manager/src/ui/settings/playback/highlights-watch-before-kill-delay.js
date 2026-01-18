import React from 'react';
import { Trans } from '@lingui/react/macro';
import { WatchBeforeKillDelay } from './watch-before-kill-delay';
import { usePlaybackSettings } from './use-playback-settings';
export function HighlightsWatchBeforeKillDelay() {
    const { highlights } = usePlaybackSettings();
    const { updateSettings } = usePlaybackSettings();
    const onChange = async (seconds) => {
        await updateSettings({
            highlights: {
                beforeKillDelayInSeconds: seconds,
            },
        });
    };
    return (React.createElement(WatchBeforeKillDelay, { title: React.createElement(Trans, { context: "Settings title" }, "Before kill delay (highlights)"), description: React.createElement(Trans, null, "How many seconds to start before a kill when watching highlights"), defaultValue: highlights.beforeKillDelayInSeconds, onChange: onChange }));
}
//# sourceMappingURL=highlights-watch-before-kill-delay.js.map