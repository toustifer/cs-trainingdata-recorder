import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Message } from 'csdm/ui/components/message';
export function NoAnalysis() {
    return React.createElement(Message, { message: React.createElement(Trans, null, "No demo analysis in progress.") });
}
//# sourceMappingURL=no-analysis.js.map