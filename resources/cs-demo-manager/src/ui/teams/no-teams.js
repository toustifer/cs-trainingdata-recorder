import React from 'react';
import { Trans } from '@lingui/react/macro';
import { CenteredContent } from 'csdm/ui/components/content';
import { useActiveTeamsFilters } from './use-active-teams-filters';
import { useTeamsState } from './use-teams-state';
export function NoTeams() {
    const { fuzzySearchText } = useTeamsState();
    const { hasActiveFilter } = useActiveTeamsFilters();
    const message = hasActiveFilter || fuzzySearchText !== '' ? (React.createElement(Trans, null, "No team found with current filters.")) : (React.createElement(Trans, null, "No team found, you have to analyze demos to generate teams."));
    return (React.createElement(CenteredContent, null,
        React.createElement("p", { className: "text-subtitle" }, message)));
}
//# sourceMappingURL=no-teams.js.map