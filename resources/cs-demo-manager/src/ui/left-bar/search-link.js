import React from 'react';
import { Trans } from '@lingui/react/macro';
import { LeftBarLink } from './left-bar-link';
import { RoutePath } from 'csdm/ui/routes-paths';
import { DatabaseSearchIcon } from '../icons/database-search-icon';
export function SearchLink() {
    return (React.createElement(LeftBarLink, { icon: React.createElement(DatabaseSearchIcon, null), tooltip: React.createElement(Trans, { context: "Tooltip" }, "Search"), url: RoutePath.Search }));
}
//# sourceMappingURL=search-link.js.map