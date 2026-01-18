import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Message } from 'csdm/ui/components/message';
import { ErrorCode } from 'csdm/common/error-code';
import { useActiveTeamFilters } from './use-active-team-filters';
export function LoadTeamError({ errorCode }) {
    const { hasActiveFilter } = useActiveTeamFilters();
    let errorMessage;
    switch (errorCode) {
        case ErrorCode.TeamNotFound: {
            if (hasActiveFilter) {
                errorMessage = React.createElement(Trans, null, "No data was found with active filters.");
                break;
            }
            errorMessage = React.createElement(Trans, null, "This team is not in any analyzed demos.");
            break;
        }
        default:
            errorMessage = React.createElement(Trans, null, "An error occurred.");
    }
    return React.createElement(Message, { message: errorMessage });
}
//# sourceMappingURL=load-team-error.js.map