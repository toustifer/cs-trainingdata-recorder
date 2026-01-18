import React from 'react';
import { Trans } from '@lingui/react/macro';
import { CenteredContent } from 'csdm/ui/components/content';
import { RetryButton } from 'csdm/ui/components/buttons/retry-button';
export function NoMatchesFound({ onRetryClick }) {
    return (React.createElement(CenteredContent, null,
        React.createElement("p", { className: "mb-12 text-subtitle" },
            React.createElement(Trans, null, "No matches found for the current Steam account.")),
        React.createElement(RetryButton, { onClick: onRetryClick })));
}
//# sourceMappingURL=no-matches-found.js.map