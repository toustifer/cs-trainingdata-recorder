import React from 'react';
import { Trans } from '@lingui/react/macro';
export function Tick({ tick }) {
    return (React.createElement("p", null,
        React.createElement(Trans, null,
            "Tick ",
            React.createElement("strong", null, tick))));
}
//# sourceMappingURL=tick.js.map