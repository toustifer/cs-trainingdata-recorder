import React, {} from 'react';
import { Trans } from '@lingui/react/macro';
import { Tooltip } from 'csdm/ui/components/tooltip';
export function DownloadRequiredTooltip({ children }) {
    return (React.createElement(Tooltip, { content: React.createElement(Trans, { context: "Tooltip" }, "You must download the demo first"), placement: "top" },
        React.createElement("div", null, children)));
}
//# sourceMappingURL=dowload-required-tooltip.js.map