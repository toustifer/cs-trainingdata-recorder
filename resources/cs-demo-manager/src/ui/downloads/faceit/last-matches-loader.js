import React, { useEffect } from 'react';
import { Trans } from '@lingui/react/macro';
import { Status } from 'csdm/common/types/status';
import { Message } from 'csdm/ui/components/message';
import { useFetchLastFaceitMatches } from './use-fetch-last-faceit-matches';
import { useCurrentFaceitAccount } from './use-current-faceit-account';
import { DownloadsFolderRequired } from '../downloads-folder-required';
import { useDownloadFolderPath } from '../../settings/downloads/use-download-folder-path';
import { Sidebar } from './sidebar';
import { CurrentMatch } from './current-match';
import { NoFaceitAccount } from './no-faceit-account';
import { useFaceitState } from './use-faceit-state';
import { ErrorCode } from 'csdm/common/error-code';
export function LastMatchesLoader() {
    const fetchLastFaceitMatches = useFetchLastFaceitMatches();
    const { status, errorCode, matches } = useFaceitState();
    const currentAccount = useCurrentFaceitAccount();
    const downloadFolderPath = useDownloadFolderPath();
    useEffect(() => {
        if (status === Status.Idle) {
            fetchLastFaceitMatches();
        }
    }, [status, fetchLastFaceitMatches]);
    if (downloadFolderPath === undefined) {
        return React.createElement(DownloadsFolderRequired, null);
    }
    if (currentAccount === undefined) {
        return React.createElement(NoFaceitAccount, null);
    }
    if (status === Status.Loading) {
        return React.createElement(Message, { message: React.createElement(Trans, null, "Fetching last matches\u2026") });
    }
    if (status === Status.Error) {
        switch (errorCode) {
            case ErrorCode.FaceItApiForbidden:
                return React.createElement(Message, { message: React.createElement(Trans, null, "The API returned a forbidden error, please check your API key.") });
            case ErrorCode.FaceItApiUnauthorized:
                return (React.createElement(Message, { message: React.createElement(Trans, null, "The API returned an unauthorized status code, please check your API key.") }));
            case ErrorCode.FaceItApiInvalidRequest:
                return React.createElement(Message, { message: React.createElement(Trans, null, "Invalid API request.") });
            case ErrorCode.FaceItApiError:
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