import React from 'react';
import { ActionBar as CommonActionBar } from 'csdm/ui/components/action-bar';
import { Status } from 'csdm/common/types/status';
import { RefreshButton } from 'csdm/ui/components/buttons/refresh-button';
import { RevealDownloadFolderInExplorerButton } from '../reveal-download-folder-in-explorer-button';
import { Select } from 'csdm/ui/components/inputs/select';
import { DownloadDemosButton } from '../download-demos-button';
import { DownloadSource } from 'csdm/common/download/download-types';
import { use5EPlayState } from './use-5eplay-state';
import { use5EPlayAccounts } from './use-5eplay-accounts';
import { useCurrent5EPlayAccount } from './use-current-5eplay-account';
import { useUpdateCurrent5EPlayAccount } from './use-update-current-5eplay-account';
import { useFetchLast5EPlayMatches } from './use-fetch-last-5eplay-matches';
function AccountSelect() {
    const { status } = use5EPlayState();
    const isDisabled = status === Status.Loading || status === Status.Idle;
    const accounts = use5EPlayAccounts();
    const currentAccount = useCurrent5EPlayAccount();
    const updateCurrentAccount = useUpdateCurrent5EPlayAccount();
    const options = accounts.map((account) => {
        return {
            value: account.id,
            label: account.nickname,
        };
    });
    const onChange = async (accountId) => {
        await updateCurrentAccount(accountId);
    };
    if (accounts.length === 0) {
        return null;
    }
    return React.createElement(Select, { options: options, value: currentAccount?.id, onChange: onChange, isDisabled: isDisabled });
}
function RefreshMatchesButton() {
    const fetchLastMatches = useFetchLast5EPlayMatches();
    const { status } = use5EPlayState();
    const isDisabled = status === Status.Loading || status === Status.Idle;
    return React.createElement(RefreshButton, { onClick: fetchLastMatches, isDisabled: isDisabled });
}
function DownloadAllButton() {
    const { status, matches } = use5EPlayState();
    const downloads = matches.map((match) => {
        return {
            demoUrl: match.demoUrl,
            fileName: match.id,
            game: match.game,
            match: match,
            matchId: match.id,
            source: DownloadSource['5EPlay'],
        };
    });
    return React.createElement(DownloadDemosButton, { downloads: downloads, loadingStatus: status });
}
export function FiveEPlayActionBar() {
    return (React.createElement(CommonActionBar, { left: React.createElement(React.Fragment, null,
            React.createElement(RefreshMatchesButton, null),
            React.createElement(DownloadAllButton, null),
            React.createElement(RevealDownloadFolderInExplorerButton, null),
            React.createElement(AccountSelect, null)) }));
}
//# sourceMappingURL=5eplay-action-bar.js.map