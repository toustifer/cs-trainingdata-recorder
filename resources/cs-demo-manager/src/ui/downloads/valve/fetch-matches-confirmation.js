import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Button, ButtonVariant } from 'csdm/ui/components/buttons/button';
import { CenteredContent } from 'csdm/ui/components/content';
export function FetchMatchesConfirmation({ onContinueClick }) {
    return (React.createElement(CenteredContent, null,
        React.createElement("p", { className: "mb-12 text-subtitle" },
            React.createElement(Trans, null, "It will close Counter-Strike if it's running and start automatically for a few seconds.")),
        React.createElement(Button, { onClick: onContinueClick, variant: ButtonVariant.Primary },
            React.createElement(Trans, null, "Continue"))));
}
//# sourceMappingURL=fetch-matches-confirmation.js.map