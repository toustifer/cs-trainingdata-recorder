import React from 'react';
import { Trans } from '@lingui/react/macro';
import { roundNumber } from 'csdm/common/math/round-number';
function MegaBytes({ mb }) {
    const roundedMb = roundNumber(mb, 2);
    return React.createElement(Trans, { context: "Disk usage in megabyte" },
        "~",
        roundedMb,
        "MB");
}
function GigaBytes({ gb }) {
    const roundedGb = roundNumber(gb, 2);
    return React.createElement(Trans, { context: "Disk usage in gigabyte" },
        "~",
        roundedGb,
        "GB");
}
export function RequiredDiskSpace({ bytes }) {
    const minimumGigabyteWarning = 20;
    const mb = bytes / 1024 / 1024;
    const gb = mb / 1024;
    return (React.createElement("span", { className: gb >= minimumGigabyteWarning ? 'text-red-600' : undefined }, gb > 1 ? React.createElement(GigaBytes, { gb: gb }) : React.createElement(MegaBytes, { mb: mb })));
}
//# sourceMappingURL=required-disk-space.js.map