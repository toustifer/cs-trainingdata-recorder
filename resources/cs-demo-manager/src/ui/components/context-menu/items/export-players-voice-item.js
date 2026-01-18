import React, { useEffect, useState } from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { ContextMenuItem } from 'csdm/ui/components/context-menu/context-menu-item';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'csdm/ui/dialogs/dialog';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { RevealFolderInExplorerButton } from 'csdm/ui/components/buttons/reveal-folder-in-explorer-button';
import { ButtonVariant } from 'csdm/ui/components/buttons/button';
import { CloseButton } from 'csdm/ui/components/buttons/close-button';
import { RendererServerMessageName } from 'csdm/server/renderer-server-message-name';
import { ErrorCode } from 'csdm/common/error-code';
import { ErrorMessage } from 'csdm/ui/components/error-message';
import { ExclamationTriangleIcon } from 'csdm/ui/icons/exclamation-triangle-icon';
import { ExternalLink } from 'csdm/ui/components/external-link';
import { Select } from 'csdm/ui/components/inputs/select';
import { ExportVoiceMode } from 'csdm/node/csgo-voice-extractor/export-voice-mode';
import { CancelButton } from 'csdm/ui/components/buttons/cancel-button';
import { InputLabel } from 'csdm/ui/components/inputs/input-label';
import { ConfirmButton } from 'csdm/ui/components/buttons/confirm-button';
import { PlayersSelect } from '../../inputs/select/players-select';
function ExportPlayersVoiceDialog({ outputFolderPath }) {
    const { hideDialog } = useDialog();
    const client = useWebSocketClient();
    const [warnings, setWarnings] = useState([]);
    const [message, setMessage] = useState(React.createElement(Trans, null, "Export in progress\u2026"));
    const [error, setError] = useState(undefined);
    const [isExporting, setIsExporting] = useState(true);
    useEffect(() => {
        const onProgress = ({ demoNumber, totalDemoCount }) => {
            setMessage(React.createElement(Trans, null,
                "Exporting demo ",
                demoNumber,
                " of ",
                totalDemoCount,
                "..."));
        };
        const onDone = () => {
            setIsExporting(false);
            setMessage(React.createElement(Trans, null, "Export done."));
        };
        const onError = ({ demoPath, errorCode }) => {
            const addWarning = (warning) => {
                setWarnings((prevWarnings) => [...prevWarnings, warning]);
            };
            switch (errorCode) {
                case ErrorCode.DemoNotFound:
                    addWarning(React.createElement(Trans, null,
                        "Demo not found: ",
                        demoPath));
                    break;
                case ErrorCode.CsVoiceExtractorDecodingError:
                    addWarning(React.createElement(Trans, null,
                        "Decoding error: ",
                        demoPath));
                    break;
                case ErrorCode.CsVoiceExtractorNoVoiceDataFound:
                    addWarning(React.createElement(Trans, null,
                        "No voice data found for demo: ",
                        demoPath));
                    break;
                case ErrorCode.CsVoiceExtractorParsingError:
                    addWarning(React.createElement(Trans, null,
                        "Failed to parse demo: ",
                        demoPath));
                    break;
                case ErrorCode.CsVoiceExtractorUnsupportedAudioCodec:
                    addWarning(React.createElement(Trans, null,
                        "Unsupported audio codec: ",
                        demoPath));
                    break;
                case ErrorCode.CsVoiceExtractorCreateAudioFileError:
                    addWarning(React.createElement(Trans, null,
                        "Failed to create audio file: ",
                        demoPath));
                    break;
                case ErrorCode.CsVoiceExtractorInvalidArgs:
                    addWarning(React.createElement(Trans, null,
                        "Invalid arguments for demo: ",
                        demoPath));
                    break;
                case ErrorCode.CsVoiceExtractorLoadCsgoLibError:
                    setError(React.createElement(Trans, null, "Failed to load the Counter-Strike audio library."));
                    break;
                case ErrorCode.CsVoiceExtractorOpenDemoError:
                    addWarning(React.createElement(Trans, null, "Failed to open the demo file."));
                    break;
                case ErrorCode.CsVoiceExtractorMissingLibraryFiles:
                    setError(React.createElement(Trans, null, "Some required library files are missing."));
                    break;
                case ErrorCode.CsVoiceExtractorUnsupportedDemoFormat:
                    addWarning(React.createElement(Trans, null, "This demo format is not supported."));
                    break;
                case ErrorCode.BadCpuType:
                    setError(React.createElement(Trans, null,
                        "You need to install ",
                        React.createElement(ExternalLink, { href: "https://support.apple.com/en-us/HT211861" }, "Rosetta"),
                        "."));
                    break;
                case ErrorCode.UnknownError:
                    setError(React.createElement(Trans, null, "An error occurred."));
                    break;
            }
        };
        client.on(RendererServerMessageName.ExportDemoPlayersVoiceProgress, onProgress);
        client.on(RendererServerMessageName.ExportDemoPlayersVoiceDone, onDone);
        client.on(RendererServerMessageName.ExportDemoPlayersVoiceError, onError);
        return () => {
            client.off(RendererServerMessageName.ExportDemoPlayersVoiceProgress, onProgress);
            client.off(RendererServerMessageName.ExportDemoPlayersVoiceDone, onDone);
            client.off(RendererServerMessageName.ExportDemoPlayersVoiceError, onError);
        };
    }, [client]);
    return (React.createElement(Dialog, { closeOnBackgroundClicked: !isExporting, closeOnEscPressed: !isExporting },
        React.createElement("div", { className: "w-[768px]" },
            React.createElement(DialogHeader, null,
                React.createElement(DialogTitle, null,
                    React.createElement(Trans, null, "Players voice export"))),
            React.createElement(DialogContent, null,
                React.createElement("div", { className: "mb-16 flex items-center gap-x-4" },
                    React.createElement(ExclamationTriangleIcon, { className: "size-16 text-red-700" }),
                    React.createElement("p", null,
                        React.createElement(Trans, null, "Valve Matchmaking demos do not contain voice audio data!"))),
                warnings.length > 0 && (React.createElement("div", { className: "flex flex-col" },
                    React.createElement("div", { className: "mb-8 flex items-center gap-x-8" },
                        React.createElement(ExclamationTriangleIcon, { className: "size-16 text-orange-700" }),
                        React.createElement("p", null,
                            React.createElement(Trans, null, "Warnings:"))),
                    React.createElement("ul", { className: "flex max-h-[224px] max-w-[824px] flex-col gap-y-8 overflow-auto rounded bg-gray-100 p-8" }, warnings.map((warning, index) => {
                        return (React.createElement("li", { key: `${warning}${index}`, className: "selectable break-all select-text" }, warning));
                    })))),
                React.createElement("p", { className: "my-8" }, message),
                error !== undefined && React.createElement(ErrorMessage, { message: error })),
            React.createElement(DialogFooter, null,
                React.createElement(RevealFolderInExplorerButton, { path: outputFolderPath, variant: ButtonVariant.Primary }),
                React.createElement(CloseButton, { onClick: hideDialog, isDisabled: isExporting })))));
}
function SelectExportModeDialog({ onSelect, players }) {
    const { hideDialog } = useDialog();
    const [mode, setMode] = useState(ExportVoiceMode.SingleFull);
    const [steamIds, setSteamIds] = useState([]);
    const options = [
        {
            label: React.createElement(Trans, { context: "Voice mode export label" }, "One file per player (no silence, only voice)"),
            value: ExportVoiceMode.SplitCompact,
        },
        {
            label: React.createElement(Trans, { context: "Voice mode export label" }, "One file per player (with silence, demo length)"),
            value: ExportVoiceMode.SplitFull,
        },
        {
            label: React.createElement(Trans, { context: "Voice mode export label" }, "Single file (all players, with silence, demo length)"),
            value: ExportVoiceMode.SingleFull,
        },
    ];
    return (React.createElement(Dialog, null,
        React.createElement("div", { className: "w-[768px]" },
            React.createElement(DialogHeader, null,
                React.createElement(DialogTitle, null,
                    React.createElement(Trans, null, "Players voice export"))),
            React.createElement(DialogContent, null,
                React.createElement("div", { className: "flex flex-col gap-y-8" },
                    React.createElement(InputLabel, null,
                        React.createElement(Trans, null, "Choose how you want the voice audio to be exported")),
                    React.createElement("div", null,
                        React.createElement(Select, { options: options, value: mode, onChange: setMode }),
                        players && players.length > 0 && (React.createElement("div", { className: "mt-12 max-h-[220px] overflow-auto" },
                            React.createElement(PlayersSelect, { players: players, selectedSteamIds: steamIds, onChange: setSteamIds, filter: null })))))),
            React.createElement(DialogFooter, null,
                React.createElement(ConfirmButton, { onClick: () => {
                        onSelect(mode, steamIds);
                    } }),
                React.createElement(CancelButton, { onClick: hideDialog })))));
}
export function ExportPlayersVoiceItem({ demoPaths, players }) {
    const client = useWebSocketClient();
    const { showDialog } = useDialog();
    const { t } = useLingui();
    const onClick = () => {
        showDialog(React.createElement(SelectExportModeDialog, { players: players, onSelect: async (mode, steamIds) => {
                const { filePaths, canceled } = await window.csdm.showOpenDialog({
                    buttonLabel: t({
                        context: 'Button label',
                        message: 'Export',
                    }),
                    defaultPath: window.csdm.getPathDirectoryName(demoPaths[0]),
                    properties: ['openDirectory'],
                });
                if (canceled || filePaths.length === 0) {
                    return;
                }
                const outputPath = filePaths[0];
                showDialog(React.createElement(ExportPlayersVoiceDialog, { outputFolderPath: outputPath }));
                client.send({
                    name: RendererClientMessageName.ExportDemoPlayersVoice,
                    payload: {
                        demoPaths,
                        outputPath,
                        mode,
                        steamIds,
                    },
                });
            } }));
    };
    return (React.createElement(ContextMenuItem, { onClick: onClick, isDisabled: demoPaths.length === 0 },
        React.createElement(Trans, { context: "Context menu" }, "Players voice")));
}
//# sourceMappingURL=export-players-voice-item.js.map