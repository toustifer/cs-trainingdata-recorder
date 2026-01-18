import React from 'react';
import { ActionBar as CommonActionBar } from 'csdm/ui/components/action-bar';
import { Status } from 'csdm/common/types/status';
import { RefreshButton } from 'csdm/ui/components/buttons/refresh-button';
import { RevealDownloadFolderInExplorerButton } from '../reveal-download-folder-in-explorer-button';
import { useCurrentFaceitAccount } from './use-current-faceit-account';
import { useFaceitAccounts } from './use-faceit-accounts';
import { Select } from 'csdm/ui/components/inputs/select';
import { useUpdateCurrentFaceitAccount } from './use-update-current-faceit-account';
import { DownloadDemosButton } from '../download-demos-button';
import { DownloadSource } from 'csdm/common/download/download-types';
import { useFaceitMatches } from './use-faceit-matches';
import { useFetchLastFaceitMatches } from './use-fetch-last-faceit-matches';
import { useFaceitStatus } from './use-faceit-status';
function AccountSelect() {
    const status = useFaceitStatus();
    const isDisabled = status === Status.Loading || status === Status.Idle;
    const accounts = useFaceitAccounts();
    const currentAccount = useCurrentFaceitAccount();
    const updateCurrentFaceitAccount = useUpdateCurrentFaceitAccount();
    const options = accounts.map((account) => {
        return {
            value: account.id,
            label: account.nickname,
        };
    });
    const onChange = async (accountId) => {
        await updateCurrentFaceitAccount(accountId);
    };
    if (accounts.length === 0) {
        return null;
    }
    return React.createElement(Select, { options: options, value: currentAccount?.id, onChange: onChange, isDisabled: isDisabled });
}
function RefreshMatchesButton() {
    const fetchLastFaceitMatches = useFetchLastFaceitMatches();
    const status = useFaceitStatus();
    const isDisabled = status === Status.Loading || status === Status.Idle;
    return React.createElement(RefreshButton, { onClick: fetchLastFaceitMatches, isDisabled: isDisabled });
}
function DownloadAllButton() {
    const matches = useFaceitMatches();
    const status = useFaceitStatus();
    const downloads = matches.map((match) => {
        return {
            demoUrl: match.demoUrl,
            fileName: match.id,
            game: match.game,
            match: match,
            matchId: match.id,
            source: DownloadSource.Faceit,
        };
    });
    return React.createElement(DownloadDemosButton, { downloads: downloads, loadingStatus: status });
}
export function ActionBar() {
    return (React.createElement(CommonActionBar, { left: React.createElement(React.Fragment, null,
            React.createElement(RefreshMatchesButton, null),
            React.createElement(DownloadAllButton, null),
            React.createElement(RevealDownloadFolderInExplorerButton, null),
            React.createElement(AccountSelect, null)) }));
}
//# sourceMappingURL=action-bar.js.map