import React from 'react';
import { Trans } from '@lingui/react/macro';
import { CopyButton } from './copy-button';
export function CopySteamIdButton({ steamId }) {
    return (React.createElement(CopyButton, { data: steamId },
        React.createElement(Trans, null, "Copy SteamID")));
}
//# sourceMappingURL=copy-steamid-button.js.map