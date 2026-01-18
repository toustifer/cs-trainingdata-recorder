import React from 'react';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
import { CopyShareCodeButton } from 'csdm/ui/components/buttons/copy-share-code-button';
export function CopyMatchShareCodeButton() {
    const match = useCurrentMatch();
    return React.createElement(CopyShareCodeButton, { shareCode: match.shareCode });
}
//# sourceMappingURL=copy-match-share-code.js.map