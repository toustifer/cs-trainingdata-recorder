import React, { useEffect } from 'react';
import { Trans } from '@lingui/react/macro';
import { Status } from 'csdm/common/types/status';
import { Message } from 'csdm/ui/components/message';
import { DownloadsFolderRequired } from '../downloads-folder-required';
import { useDownloadFolderPath } from '../../settings/downloads/use-download-folder-path';
import { ErrorCode } from 'csdm/common/error-code';
import { use5EPlayState } from './use-5eplay-state';
import { useFetchLast5EPlayMatches } from './use-fetch-last-5eplay-matches';
import { useCurrent5EPlayAccount } from './use-current-5eplay-account';
import { No5EPlayAccount } from './no-5eplay-account';
import { FiveEPlayDownloadSidebar } from './5eplay-download-sidebar';
import { FiveEPlayCurrentMatch } from './5eplay-current-match';
export function FiveEPlayLastMatchesLoader() {
    const fetchLastMatches = useFetchLast5EPlayMatches();
    const { status, errorCode, matches } = use5EPlayState();
    const currentAccount = useCurrent5EPlayAccount();
    const downloadFolderPath = useDownloadFolderPath();
    useEffect(() => {
        if (status === Status.Idle) {
            fetchLastMatches();
        }
    }, [status, fetchLastMatches]);
    if (downloadFolderPath === undefined) {
        return React.createElement(DownloadsFolderRequired, null);
    }
    if (currentAccount === undefined) {
        return React.createElement(No5EPlayAccount, null);
    }
    if (status === Status.Loading) {
        return React.createElement(Message, { message: React.createElement(Trans, null, "Fetching last matches\u2026") });
    }
    if (status === Status.Error) {
        switch (errorCode) {
            case ErrorCode.FiveEPlayApiInvalidRequest:
                return React.createElement(Message, { message: React.createElement(Trans, null, "Invalid request.") });
            case ErrorCode.FiveEPlayApiError:
                return React.createElement(Message, { message: React.createElement(Trans, null, "The API returned an error, please re-try later.") });
            default:
                return React.createElement(Message, { message: React.createElement(Trans, null, "An error occurred.") });
        }
    }
    if (matches.length === 0) {
        return React.createElement(Message, { message: React.createElement(Trans, null, "No matches found for the current account.") });
    }
    return (React.createElement("div", { className: "flex overflow-hidden" },
        React.createElement(FiveEPlayDownloadSidebar, null),
        React.createElement(FiveEPlayCurrentMatch, null)));
}
//# sourceMappingURL=5eplay-last-matches-loader.js.map