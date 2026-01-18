import React, {} from 'react';
import { Trans } from '@lingui/react/macro';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { useHlaeSettings } from 'csdm/ui/settings/video/hlae/use-hlae-settings';
import { RevealFileInExplorerButton } from 'csdm/ui/components/buttons/reveal-file-in-explorer-button';
import { Checkbox } from 'csdm/ui/components/inputs/checkbox';
import { TextInput } from 'csdm/ui/components/inputs/text-input';
import { ErrorCode } from 'csdm/common/error-code';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { hlaeVersionChanged } from '../../settings-actions';
import { useShowToast } from 'csdm/ui/components/toasts/use-show-toast';
import { ResetButton } from 'csdm/ui/components/buttons/reset-button';
import { ChangeButton } from 'csdm/ui/components/buttons/change-button';
async function showSelectExecutableDialog() {
    const { filePaths, canceled } = await window.csdm.showOpenDialog({
        filters: [{ extensions: ['exe'], name: 'HLAE.exe' }],
        properties: ['openFile'],
    });
    if (canceled || filePaths.length === 0) {
        return;
    }
    const executablePath = filePaths[0];
    return executablePath;
}
export function HlaeLocation() {
    const { hlaeSettings } = useHlaeSettings();
    const dispatch = useDispatch();
    const { customExecutableLocation, customLocationEnabled } = hlaeSettings;
    const showToast = useShowToast();
    const client = useWebSocketClient();
    const handleError = (error) => {
        showToast({
            id: 'hlae-custom-location-error',
            content: error,
            type: 'error',
        });
    };
    const enableCustomLocation = async (executablePath) => {
        try {
            const result = await client.send({
                name: RendererClientMessageName.EnableHlaeCustomLocation,
                payload: executablePath,
            });
            dispatch(hlaeVersionChanged(result));
        }
        catch (error) {
            let errorMessage = React.createElement(Trans, null, "An error occurred");
            switch (error) {
                case ErrorCode.FileNotFound:
                    errorMessage = React.createElement(Trans, null, "File not found");
                    break;
                case ErrorCode.InvalidHlaeExecutable:
                    errorMessage = React.createElement(Trans, null, "Invalid HLAE executable");
                    break;
            }
            handleError(errorMessage);
        }
    };
    const disableCustomLocation = async (clearCustomLocation) => {
        const result = await client.send({
            name: RendererClientMessageName.DisableHlaeCustomLocation,
            payload: clearCustomLocation,
        });
        dispatch(hlaeVersionChanged(result));
        // Ignore known errors because if one occurs, HLAE will be flagged as not installed.
        if (result.errorCode === ErrorCode.UnknownError) {
            handleError(React.createElement(Trans, null, "An error occurred"));
        }
    };
    const onCheckboxChange = async (event) => {
        const shouldEnableCustomLocation = event.target.checked;
        if (shouldEnableCustomLocation) {
            let newExecutablePath = customExecutableLocation;
            if (customExecutableLocation === '') {
                const executablePath = await showSelectExecutableDialog();
                if (executablePath === undefined) {
                    return;
                }
                newExecutablePath = executablePath;
            }
            enableCustomLocation(newExecutablePath);
        }
        else {
            const clearCustomLocation = false;
            disableCustomLocation(clearCustomLocation);
        }
    };
    const onChangeClick = async () => {
        const executablePath = await showSelectExecutableDialog();
        if (executablePath === undefined) {
            return;
        }
        await enableCustomLocation(executablePath);
    };
    const onResetClick = () => {
        const clearCustomLocation = true;
        disableCustomLocation(clearCustomLocation);
    };
    const isBrowseButtonDisabled = customExecutableLocation === '';
    const isResetButtonDisabled = customExecutableLocation === '' && !customLocationEnabled;
    return (React.createElement("div", { className: "flex flex-col gap-y-4" },
        React.createElement(Checkbox, { label: React.createElement(Trans, null, "Enable custom location"), isChecked: customLocationEnabled, onChange: onCheckboxChange }),
        React.createElement("div", { className: "flex items-center gap-x-8" },
            React.createElement(TextInput, { value: customExecutableLocation, isReadOnly: true }),
            React.createElement(RevealFileInExplorerButton, { path: customExecutableLocation, isDisabled: isBrowseButtonDisabled }),
            React.createElement(ChangeButton, { isDisabled: !customLocationEnabled, onClick: onChangeClick }),
            React.createElement(ResetButton, { isDisabled: isResetButtonDisabled, onClick: onResetClick }))));
}
//# sourceMappingURL=hlae-location.js.map