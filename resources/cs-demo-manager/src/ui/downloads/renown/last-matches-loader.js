import React, { useEffect } from 'react';
import { Trans } from '@lingui/react/macro';
import { Status } from 'csdm/common/types/status';
import { Message } from 'csdm/ui/components/message';
import { DownloadsFolderRequired } from '../downloads-folder-required';
import { useDownloadFolderPath } from '../../settings/downloads/use-download-folder-path';
import { NoRenownAccount } from './no-renown-account';
import { ErrorCode } from 'csdm/common/error-code';
import { useFetchLastRenownMatches } from './use-fetch-last-renown-matches';
import { useRenownState } from './use-renown-state';
import { useCurrentRenownAccount } from './use-current-renown-account';
import { Sidebar } from './sidebar';
import { CurrentMatch } from './current-match';
export function LastMatchesLoader() {
    const fetchLastMatches = useFetchLastRenownMatches();
    const { status, errorCode, matches } = useRenownState();
    const currentAccount = useCurrentRenownAccount();
    const downloadFolderPath = useDownloadFolderPath();
    useEffect(() => {
        if (status === Status.Idle) {
            fetchLastMatches();
        }
    }, [status, fetchLastMatches]);
    if (!downloadFolderPath) {
        return React.createElement(DownloadsFolderRequired, null);
    }
    if (!currentAccount) {
        return React.createElement(NoRenownAccount, null);
    }
    if (status === Status.Loading) {
        return React.createElement(Message, { message: React.createElement(Trans, null, "Fetching last matches\u2026") });
    }
    if (status === Status.Error) {
        switch (errorCode) {
            case ErrorCode.RenownTooManyRequests:
                return React.createElement(Message, { message: React.createElement(Trans, null, "Too many requests sent to the API.") });
            case ErrorCode.RenownInvalidRequest:
                return React.createElement(Message, { message: React.createElement(Trans, null, "Invalid API request.") });
            case ErrorCode.RenownApiError:
                return React.createElement(Message, { message: React.createElement(Trans, null, "The API returned an error, please re-try later.") });
            default:
                return React.createElement(Message, { message: React.createElement(Trans, null, "An error occurred.") });
        }
    }
    if (matches.length === 0) {
        return React.createElement(Message, { message: React.createElement(Trans, null, "No matches found for the current account.") });
    }
    return (React.createElement("div", { className: "flex overflow-hidden" },
        React.createElement(Sidebar, null),
        React.createElement(CurrentMatch, null)));
}
//# sourceMappingURL=last-matches-loader.js.map