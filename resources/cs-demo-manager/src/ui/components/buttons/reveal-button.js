import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Button } from 'csdm/ui/components/buttons/button';
export function RevealButton({ onClick }) {
    return (React.createElement(Button, { onClick: onClick },
        React.createElement(Trans, { context: "Button" }, "Reveal")));
}
//# sourceMappingURL=reveal-button.js.map