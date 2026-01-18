import React, { useState } from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { TextInput } from 'csdm/ui/components/inputs/text-input';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { ConfirmDialog } from 'csdm/ui/dialogs/confirm-dialog';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { useShowToast } from 'csdm/ui/components/toasts/use-show-toast';
import { ErrorMessage } from 'csdm/ui/components/error-message';
import { use5EPlayAccounts } from 'csdm/ui/downloads/five-eplay/use-5eplay-accounts';
import { useUpdateCurrent5EPlayAccount } from 'csdm/ui/downloads/five-eplay/use-update-current-5eplay-account';
import { FiveEPlayAccountInstructions } from 'csdm/ui/downloads/five-eplay/five-eplay-account-instructions';
import { useAdd5EPlayAcount } from './use-add-5eplay-account';
import { accountsUpdated } from 'csdm/ui/downloads/five-eplay/5eplay-actions';
import { ThirdPartySettings } from './third-party-settings';
import { ThirdPartyAccounts } from './third-party-accounts';
function AddAccountDialog() {
    const [domainId, setDomainId] = useState('');
    const { add5EPlayAccount, errorMessage, isBusy } = useAdd5EPlayAcount();
    const { hideDialog } = useDialog();
    const { t } = useLingui();
    const onConfirm = async () => {
        const accountAdded = await add5EPlayAccount(domainId);
        if (accountAdded) {
            hideDialog();
        }
    };
    return (React.createElement(ConfirmDialog, { title: React.createElement(Trans, null, "Add 5EPlay account"), onConfirm: onConfirm, closeOnConfirm: false, isBusy: isBusy },
        React.createElement(TextInput, { label: t({
                context: 'Input label',
                message: '5EPlay ID',
            }), placeholder: t({
                context: 'Input placeholder',
                message: 'ID',
            }), value: domainId, onChange: (event) => {
                setDomainId(event.target.value);
            }, isDisabled: isBusy, onEnterKeyDown: onConfirm, autoFocus: true }),
        React.createElement("div", { className: "mt-8" },
            React.createElement(FiveEPlayAccountInstructions, null)),
        errorMessage && (React.createElement("div", { className: "mt-8" },
            React.createElement(ErrorMessage, { message: errorMessage })))));
}
export function FiveEPlaySettings() {
    const showToast = useShowToast();
    const accounts = use5EPlayAccounts();
    const client = useWebSocketClient();
    const dispatch = useDispatch();
    const updateCurrentAccount = useUpdateCurrent5EPlayAccount();
    const { showDialog } = useDialog();
    const deleteAccount = async (accountId) => {
        try {
            const accounts = await client.send({
                name: RendererClientMessageName.Delete5EPlayAccount,
                payload: accountId,
            });
            dispatch(accountsUpdated({ accounts }));
        }
        catch (error) {
            showToast({
                content: React.createElement(Trans, null, "An error occurred"),
                id: 'delete-5eplay-account-error',
                type: 'error',
            });
        }
    };
    return (React.createElement(ThirdPartySettings, { name: "5EPlay", logo: React.createElement("img", { src: `file://${window.csdm.IMAGES_FOLDER_PATH}/sources/5eplay.png`, alt: "", className: "h-20" }), autoDownloadAtStartupSettingsKey: "download5EPlayDemosAtStartup", autoDownloadInBackgroundSettingsKey: "download5EPlayDemosInBackground" },
        React.createElement(ThirdPartyAccounts, { accounts: accounts, getAccountUrl: (account) => {
                return `https://arena.5eplay.com/data/player/${account.domainId}`;
            }, onSetAsCurrentClick: updateCurrentAccount, onDeleteClick: deleteAccount, onAddClick: () => {
                showDialog(React.createElement(AddAccountDialog, null));
            } })));
}
//# sourceMappingURL=5eplay-settings.js.map