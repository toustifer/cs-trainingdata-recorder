import React from 'react';
import { WatchButton } from 'csdm/ui/components/buttons/watch-button';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
export function WatchMatchButton() {
    const match = useCurrentMatch();
    return React.createElement(WatchButton, { demoPath: match.demoFilePath, game: match.game });
}
//# sourceMappingURL=watch-match-button.js.map