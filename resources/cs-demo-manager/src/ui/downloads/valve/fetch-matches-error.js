import React from 'react';
import { CenteredContent } from 'csdm/ui/components/content';
import { RetryButton } from 'csdm/ui/components/buttons/retry-button';
export function FetchMatchesInfoError({ error, onRetryClick }) {
    return (React.createElement(CenteredContent, null,
        React.createElement("p", { className: "mb-8 text-subtitle" }, error),
        React.createElement(RetryButton, { onClick: onRetryClick })));
}
//# sourceMappingURL=fetch-matches-error.js.map