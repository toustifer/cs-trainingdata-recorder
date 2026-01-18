import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Link } from './link';
import { buildMatchRoundPath } from 'csdm/ui/routes-paths';
export function SeeRoundLink({ checksum, roundNumber }) {
    return (React.createElement(Link, { to: buildMatchRoundPath(checksum, roundNumber) },
        React.createElement(Trans, { context: "Link" }, "See round")));
}
//# sourceMappingURL=see-round-link.js.map