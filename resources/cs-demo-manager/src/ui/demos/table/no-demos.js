import React from 'react';
import { Trans } from '@lingui/react/macro';
import { CenteredContent } from 'csdm/ui/components/content';
import { useActiveDemosFilters } from '../use-active-demos-filters';
import { useDemosState } from '../use-demos-state';
export function NoDemos() {
    const { hasActiveFilter } = useActiveDemosFilters();
    const { fuzzySearchText } = useDemosState();
    const message = hasActiveFilter || fuzzySearchText !== '' ? (React.createElement(Trans, null, "No demos found with current filters.")) : (React.createElement(Trans, null, "No demos found in the current folder."));
    return (React.createElement(CenteredContent, null,
        React.createElement("p", { className: "text-subtitle" }, message)));
}
//# sourceMappingURL=no-demos.js.map