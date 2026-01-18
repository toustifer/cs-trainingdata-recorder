import React from 'react';
import { Trans } from '@lingui/react/macro';
import { LeftBarLink } from 'csdm/ui/left-bar/left-bar-link';
import { RoutePath } from 'csdm/ui/routes-paths';
import { CalendarIcon } from 'csdm/ui/icons/calendar-icon';
export function MatchesLink() {
    return (React.createElement(LeftBarLink, { icon: React.createElement(CalendarIcon, null), tooltip: React.createElement(Trans, { context: "Tooltip" }, "Matches"), url: RoutePath.Matches }));
}
//# sourceMappingURL=matches-link.js.map