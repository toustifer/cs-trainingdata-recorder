import React, {} from 'react';
import { Trans } from '@lingui/react/macro';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { RevealFileInExplorerButton } from 'csdm/ui/components/buttons/reveal-file-in-explorer-button';
import { Checkbox } from 'csdm/ui/components/inputs/checkbox';
import { TextInput } from 'csdm/ui/components/inputs/text-input';
import { ErrorCode } from 'csdm/common/error-code';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useFfmpegSettings } from './use-ffmpeg-settings';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { ffmpegVersionChanged } from '../../settings-actions';
import { ResetButton } from 'csdm/ui/components/buttons/reset-button';
import { ChangeButton } from 'csdm/ui/components/buttons/change-button';
import { useShowToast } from 'csdm/ui/components/toasts/use-show-toast';
async function showSelectExecutableDialog() {
    let filters = [];
    if (window.csdm.isWindows) {
        filters = [{ extensions: ['exe'], name: 'ffmpeg.exe' }];
    }
    const { filePaths, canceled } = await window.csdm.showOpenDialog({
        filters,
        properties: ['openFile'],
    });
    if (canceled || filePaths.length === 0) {
        return;
    }
    const executablePath = filePaths[0];
    return executablePath;
}
export function FfmpegLocation() {
    const ffmpegSettings = useFfmpegSettings();
    const { customExecutableLocation, customLocationEnabled } = ffmpegSettings;
    const dispatch = useDispatch();
    const client = useWebSocketClient();
    const showToast = useShowToast();
    const handleError = (error) => {
        showToast({
            id: 'ffmpeg-custom-location-error',
            content: error,
            type: 'error',
        });
    };
    const enableFfmpegCustomLocation = async (executablePath) => {
        try {
            const result = await client.send({
                name: RendererClientMessageName.EnableFfmpegCustomLocation,
                payload: executablePath,
            });
            dispatch(ffmpegVersionChanged(result));
        }
        catch (error) {
            let errorMessage = React.createElement(Trans, null, "An error occurred");
            switch (error) {
                case ErrorCode.FileNotFound:
                    errorMessage = React.createElement(Trans, null, "File not found");
                    break;
                case ErrorCode.InvalidFfmpegExecutable:
                    errorMessage = React.createElement(Trans, null, "Invalid FFmpeg executable");
                    break;
            }
            handleError(errorMessage);
        }
    };
    const disableFfmpegCustomLocation = async (clearCustomLocation) => {
        const result = await client.send({
            name: RendererClientMessageName.DisableFfmpegCustomLocation,
            payload: clearCustomLocation,
        });
        dispatch(ffmpegVersionChanged(result));
        // Ignore known errors because if one occurs, FFmpeg will be flagged as not installed.
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
            enableFfmpegCustomLocation(newExecutablePath);
        }
        else {
            const clearCustomLocation = false;
            disableFfmpegCustomLocation(clearCustomLocation);
        }
    };
    const onChangeClick = async () => {
        const executablePath = await showSelectExecutableDialog();
        if (executablePath === undefined) {
            return;
        }
        await enableFfmpegCustomLocation(executablePath);
    };
    const onResetClick = () => {
        const clearCustomLocation = true;
        disableFfmpegCustomLocation(clearCustomLocation);
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
//# sourceMappingURL=ffmpeg-location.js.map