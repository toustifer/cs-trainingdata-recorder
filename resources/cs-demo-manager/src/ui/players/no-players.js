import React from 'react';
import { Trans } from '@lingui/react/macro';
import { CenteredContent } from 'csdm/ui/components/content';
import { useActivePlayersFilters } from './use-active-players-filters';
import { usePlayersState } from './use-players-state';
export function NoPlayers() {
    const { fuzzySearchText } = usePlayersState();
    const { hasActiveFilter } = useActivePlayersFilters();
    const message = hasActiveFilter || fuzzySearchText !== '' ? (React.createElement(Trans, null, "No player found with current filters.")) : (React.createElement(Trans, null, "No player found, you have to analyze demos to generate players."));
    return (React.createElement(CenteredContent, null,
        React.createElement("p", { className: "text-subtitle" }, message)));
}
//# sourceMappingURL=no-players.js.map