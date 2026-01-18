import React from 'react';
import { Trans } from '@lingui/react/macro';
import { WatchBeforeKillDelay } from './watch-before-kill-delay';
import { usePlaybackSettings } from './use-playback-settings';
export function WatchRoundAfterDelay() {
    const { round, updateSettings } = usePlaybackSettings();
    const onChange = async (seconds) => {
        await updateSettings({
            round: {
                afterRoundDelayInSeconds: seconds,
            },
        });
    };
    return (React.createElement(WatchBeforeKillDelay, { title: React.createElement(Trans, { context: "Settings title" }, "After round delay"), description: React.createElement(Trans, null, "How many seconds to wait before skipping to the next round at the end of the round or when the player dies."), defaultValue: round.afterRoundDelayInSeconds, onChange: onChange }));
}
//# sourceMappingURL=watch-round-after-delay.js.map