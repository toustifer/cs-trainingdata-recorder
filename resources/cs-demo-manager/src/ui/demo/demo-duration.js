import React from 'react';
import { Trans } from '@lingui/react/macro';
import { DemoField } from './demo-field';
import { useSecondsToFormattedMinutes } from 'csdm/ui/hooks/use-seconds-to-formatted-minutes';
export function DemoDuration({ duration }) {
    const secondsToFormattedMinutes = useSecondsToFormattedMinutes();
    return React.createElement(DemoField, { label: React.createElement(Trans, null, "Duration:"), value: secondsToFormattedMinutes(duration) });
}
//# sourceMappingURL=demo-duration.js.map