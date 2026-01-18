import React from 'react';
import { Trans } from '@lingui/react/macro';
import { WatchBeforeKillDelay } from './watch-before-kill-delay';
import { usePlaybackSettings } from './use-playback-settings';
export function WatchRoundBeforeDelay() {
    const { round, updateSettings } = usePlaybackSettings();
    const onChange = async (seconds) => {
        await updateSettings({
            round: {
                beforeRoundDelayInSeconds: seconds,
            },
        });
    };
    return (React.createElement(WatchBeforeKillDelay, { title: React.createElement(Trans, { context: "Settings title" }, "Before round delay"), description: React.createElement(Trans, null, "How many seconds to start before the end of the round's freeze time."), defaultValue: round.beforeRoundDelayInSeconds, onChange: onChange }));
}
//# sourceMappingURL=watch-round-before-delay.js.map