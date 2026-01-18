import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Message } from 'csdm/ui/components/message';
export function LoadingDemosMessage({ loadedDemoCount, demoToLoadCount }) {
    if (loadedDemoCount === 0 || demoToLoadCount === 0) {
        return React.createElement(Message, { message: React.createElement(Trans, null, "Loading demos\u2026") });
    }
    return (React.createElement(Message, { message: React.createElement(Trans, null,
            "Loading ",
            loadedDemoCount,
            " of ",
            demoToLoadCount,
            " demos\u2026") }));
}
//# sourceMappingURL=loading-demos-message.js.map