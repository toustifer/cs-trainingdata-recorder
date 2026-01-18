import React, { useState } from 'react';
import { Plural, Trans } from '@lingui/react/macro';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { useShowToast } from 'csdm/ui/components/toasts/use-show-toast';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'csdm/ui/dialogs/dialog';
import { TextInput } from 'csdm/ui/components/inputs/text-input';
import { Button, ButtonVariant } from 'csdm/ui/components/buttons/button';
import { CancelButton } from 'csdm/ui/components/buttons/cancel-button';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { uniqueArray } from 'csdm/common/array/unique-array';
import { isErrorCode } from 'csdm/common/is-error-code';
import { ErrorCode } from 'csdm/common/error-code';
import { teamNamesUpdated } from '../matches-actions';
import { RendererServerMessageName } from 'csdm/server/renderer-server-message-name';
import { Status } from 'csdm/common/types/status';
import { ErrorMessage } from 'csdm/ui/components/error-message';
import { Spinner } from 'csdm/ui/components/spinner';
import { ExclamationTriangleIcon } from 'csdm/ui/icons/exclamation-triangle-icon';
function getInitialTeamName(matches, prop) {
    const names = uniqueArray(matches.map((match) => match[prop]));
    return names.length === 1 ? names[0] : '';
}
export function UpdateTeamNamesDialog({ matches }) {
    const client = useWebSocketClient();
    const dispatch = useDispatch();
    const showToast = useShowToast();
    const { hideDialog } = useDialog();
    const [teamNameA, setTeamNameA] = useState(() => getInitialTeamName(matches, 'teamAName'));
    const [teamNameB, setTeamNameB] = useState(getInitialTeamName(matches, 'teamBName'));
    const [status, setStatus] = useState(Status.Idle);
    const [error, setError] = useState('');
    const [updatedCount, setUpdatedCount] = useState(0);
    const isUpdating = status === Status.Loading;
    const onSubmit = async () => {
        if (isUpdating) {
            return;
        }
        try {
            setStatus(Status.Loading);
            client.on(RendererServerMessageName.TeamNamesUpdated, setUpdatedCount);
            const updates = await client.send({
                name: RendererClientMessageName.UpdateMatchesTeamNames,
                payload: {
                    checksums: matches.map((match) => match.checksum),
                    teamNameA,
                    teamNameB,
                },
            });
            const updateCount = Object.keys(updates).length;
            if (updateCount > 0) {
                showToast({
                    content: React.createElement(Plural, { value: updateCount, one: "The match has been updated", other: "# matches have been updated" }),
                    type: 'success',
                });
                dispatch(teamNamesUpdated(updates));
            }
            hideDialog();
        }
        catch (error) {
            const errorCode = isErrorCode(error) ? error : ErrorCode.UnknownError;
            let errorMessage;
            switch (errorCode) {
                case ErrorCode.DuplicateTeamName:
                    errorMessage = React.createElement(Trans, null, "The team names must be different.");
                    break;
                case ErrorCode.TeamsNotFound:
                    errorMessage = React.createElement(Trans, null, "The teams have not been found.");
                    break;
                default:
                    errorMessage = React.createElement(Trans, null, "An error occurred.");
                    break;
            }
            setError(errorMessage);
            setStatus(Status.Error);
        }
        client.off(RendererServerMessageName.TeamNamesUpdated, setUpdatedCount);
    };
    const renderMessage = () => {
        if (isUpdating) {
            const matchCount = matches.length;
            return (React.createElement("div", { className: "flex items-center gap-x-8" },
                React.createElement(Spinner, { size: 24 }),
                React.createElement("p", null,
                    React.createElement(Trans, null,
                        "Updating team names of match ",
                        updatedCount,
                        " out of ",
                        matchCount,
                        "."))));
        }
        if (status === Status.Error) {
            return React.createElement(ErrorMessage, { message: error });
        }
        return null;
    };
    const onCancelClick = async () => {
        setStatus(Status.Idle);
        await client.send({
            name: RendererClientMessageName.AbortCurrentTask,
        });
        hideDialog();
    };
    return (React.createElement(Dialog, { onEnterPressed: onSubmit, blockNavigation: isUpdating, closeOnBackgroundClicked: !isUpdating, closeOnEscPressed: !isUpdating },
        React.createElement(DialogHeader, null,
            React.createElement(DialogTitle, null,
                React.createElement(Trans, { context: "Dialog title" }, "Update team names"))),
        React.createElement(DialogContent, null,
            React.createElement("div", { className: "flex max-w-[524px] flex-col gap-y-8" },
                React.createElement(TextInput, { value: teamNameA, onChange: (event) => {
                        setTeamNameA(event.target.value);
                    }, isDisabled: isUpdating, label: React.createElement(Trans, { context: "Input label" }, "Team A") }),
                React.createElement(TextInput, { value: teamNameB, onChange: (event) => {
                        setTeamNameB(event.target.value);
                    }, isDisabled: isUpdating, label: React.createElement(Trans, { context: "Input label" }, "Team B") }),
                React.createElement("div", { className: "mt-8 flex items-center gap-x-8" },
                    React.createElement(ExclamationTriangleIcon, { className: "size-24 text-red-700" }),
                    React.createElement("div", null,
                        React.createElement("p", null,
                            React.createElement(Trans, null, "You should rename team names only to merge stats into a single team!")),
                        React.createElement("p", null,
                            React.createElement(Trans, null, "The only way to restore team names is by re-analyzing demos!")))),
                renderMessage())),
        React.createElement(DialogFooter, null,
            React.createElement(Button, { onClick: onSubmit, variant: ButtonVariant.Primary },
                React.createElement(Trans, { context: "Button" }, "Update")),
            React.createElement(CancelButton, { onClick: onCancelClick }))));
}
//# sourceMappingURL=update-team-names-dialog.js.map