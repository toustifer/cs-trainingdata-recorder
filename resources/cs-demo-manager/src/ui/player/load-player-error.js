import React from 'react';
import { Trans } from '@lingui/react/macro';
import { Message } from '../components/message';
import { useActivePlayerFilters } from './use-active-player-filters';
import { ErrorCode } from 'csdm/common/error-code';
export function LoadPlayerError({ errorCode }) {
    const { hasActiveFilter } = useActivePlayerFilters();
    let errorMessage;
    switch (errorCode) {
        case ErrorCode.PlayerNotFound: {
            if (hasActiveFilter) {
                errorMessage = React.createElement(Trans, null, "No data was found with active filters.");
                break;
            }
            errorMessage = React.createElement(Trans, null, "This player is not in any analyzed demos.");
            break;
        }
        default:
            errorMessage = React.createElement(Trans, null, "An error occurred.");
    }
    return React.createElement(Message, { message: errorMessage });
}
//# sourceMappingURL=load-player-error.js.map