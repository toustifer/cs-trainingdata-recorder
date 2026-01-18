import React from 'react';
import { scaleStyle } from './use-timeline';
import { Trans } from '@lingui/react/macro';
export function TimestampItem({ minutes }) {
    return (React.createElement("div", { className: "flex origin-left items-center", style: scaleStyle },
        React.createElement("span", { className: "ml-4" },
            React.createElement(Trans, { context: "Minutes timestamp in timelines" },
                minutes,
                " min"))));
}
//# sourceMappingURL=timestamp-item.js.map