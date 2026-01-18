import React, { useEffect, useRef, useState } from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { PlaybackBarButton } from './playback-bar-button';
import { useDialog } from 'csdm/ui/components/dialogs/use-dialog';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { ErrorCode } from 'csdm/common/error-code';
import { RendererServerMessageName } from 'csdm/server/renderer-server-message-name';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from 'csdm/ui/dialogs/dialog';
import { ExclamationTriangleIcon } from 'csdm/ui/icons/exclamation-triangle-icon';
import { ErrorMessage } from 'csdm/ui/components/error-message';
import { CloseButton } from 'csdm/ui/components/buttons/close-button';
import { Button, ButtonVariant } from 'csdm/ui/components/buttons/button';
import { useCurrentMatch } from '../../use-current-match';
import { ExternalLink } from 'csdm/ui/components/external-link';
import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { ExportVoiceMode } from 'csdm/node/csgo-voice-extractor/export-voice-mode';
import { useDispatch } from 'csdm/ui/store/use-dispatch';
import { DemoSource } from 'csdm/common/types/counter-strike';
import { SpinnableButton } from 'csdm/ui/components/buttons/spinnable-button';
import { SoundCross } from 'csdm/ui/icons/sound-cross';
import { useViewerContext } from '../use-viewer-context';
import { supportedAudioExtensions } from 'csdm/common/types/audio-extensions';
function AudioSelectorDialog({ loadAudioFile }) {
    const { hideDialog } = useDialog();
    const { t } = useLingui();
    const client = useWebSocketClient();
    const dispatch = useDispatch();
    const { demoFilePath, source } = useCurrentMatch();
    const [warnings, setWarnings] = useState([]);
    const [error, setError] = useState(undefined);
    const [isExporting, setIsExporting] = useState(false);
    const shouldAutoCloseDialog = useRef(true);
    useEffect(() => {
        const onDone = async () => {
            setIsExporting(false);
            try {
                const audioFilePath = await window.csdm.getDemoAudioFilePath(demoFilePath);
                if (audioFilePath) {
                    await loadAudioFile(audioFilePath);
                }
            }
            catch (error) {
                setError(React.createElement(Trans, null, "An error occurred."));
            }
            if (shouldAutoCloseDialog.current) {
                hideDialog();
            }
        };
        const onError = ({ demoPath, errorCode }) => {
            shouldAutoCloseDialog.current = false;
            const addWarning = (warning) => {
                setWarnings((prevWarnings) => [...prevWarnings, warning]);
            };
            switch (errorCode) {
                case ErrorCode.DemoNotFound:
                    addWarning(React.createElement(Trans, null,
                        "Could not find the demo file: ",
                        demoPath));
                    break;
                case ErrorCode.CsVoiceExtractorDecodingError:
                    addWarning(React.createElement(Trans, null,
                        "There was a problem decoding the demo: ",
                        demoPath));
                    break;
                case ErrorCode.CsVoiceExtractorNoVoiceDataFound:
                    addWarning(React.createElement(Trans, null,
                        "No voice data was found in: ",
                        demoPath));
                    break;
                case ErrorCode.CsVoiceExtractorParsingError:
                    addWarning(React.createElement(Trans, null,
                        "Failed to parse demo: ",
                        demoPath));
                    break;
                case ErrorCode.CsVoiceExtractorUnsupportedAudioCodec:
                    addWarning(React.createElement(Trans, null,
                        "Unsupported audio format in: ",
                        demoPath));
                    break;
                case ErrorCode.CsVoiceExtractorCreateAudioFileError:
                    addWarning(React.createElement(Trans, null,
                        "Unable to create audio file for: ",
                        demoPath));
                    break;
                case ErrorCode.CsVoiceExtractorInvalidArgs:
                    addWarning(React.createElement(Trans, null,
                        "Invalid arguments provided for: ",
                        demoPath));
                    break;
                case ErrorCode.CsVoiceExtractorLoadCsgoLibError:
                    setError(React.createElement(Trans, null, "Failed to load the Counter-Strike audio library."));
                    break;
                case ErrorCode.CsVoiceExtractorOpenDemoError:
                    addWarning(React.createElement(Trans, null, "Could not open the demo file."));
                    break;
                case ErrorCode.CsVoiceExtractorMissingLibraryFiles:
                    setError(React.createElement(Trans, null, "Some required library files are missing."));
                    break;
                case ErrorCode.CsVoiceExtractorUnsupportedDemoFormat:
                    addWarning(React.createElement(Trans, null, "This demo format is not supported."));
                    break;
                case ErrorCode.BadCpuType:
                    setError(React.createElement(Trans, null,
                        "Rosetta is required. Please install it from",
                        ' ',
                        React.createElement(ExternalLink, { href: "https://support.apple.com/en-us/HT211861" }, "Apple"),
                        "."));
                    break;
                case ErrorCode.UnknownError:
                    setError(React.createElement(Trans, null, "An error occurred."));
                    break;
            }
        };
        client.on(RendererServerMessageName.ExportDemoPlayersVoiceDone, onDone);
        client.on(RendererServerMessageName.ExportDemoPlayersVoiceError, onError);
        return () => {
            client.off(RendererServerMessageName.ExportDemoPlayersVoiceDone, onDone);
            client.off(RendererServerMessageName.ExportDemoPlayersVoiceError, onError);
        };
    }, [client, dispatch, hideDialog, demoFilePath, loadAudioFile]);
    return (React.createElement(Dialog, { closeOnBackgroundClicked: !isExporting, closeOnEscPressed: !isExporting },
        React.createElement("div", { className: "w-[700px]" },
            React.createElement(DialogHeader, null,
                React.createElement(DialogTitle, null,
                    React.createElement(Trans, null, "Audio playback"))),
            React.createElement(DialogContent, null,
                React.createElement("div", { className: "flex flex-col gap-y-8" },
                    React.createElement("div", null,
                        React.createElement("p", null,
                            React.createElement(Trans, null, "No audio file was found for this demo.")),
                        React.createElement("p", { className: "mt-8" },
                            React.createElement(Trans, null, "You can either:")),
                        React.createElement("ul", { className: "ml-16 list-inside list-disc" },
                            React.createElement("li", null,
                                React.createElement(Trans, null,
                                    "Generate a ",
                                    React.createElement("code", null, ".wav"),
                                    " file containing the players' voice audio next to the demo file."),
                                source === DemoSource.Valve && (React.createElement("div", { className: "ml-16 flex items-center gap-x-4" },
                                    React.createElement(ExclamationTriangleIcon, { className: "size-16 text-red-700" }),
                                    React.createElement("p", null,
                                        React.createElement(Trans, null, "Valve Matchmaking demos do not contain voice audio data!"))))),
                            React.createElement("li", null,
                                React.createElement(Trans, null, "Select an existing audio file from your computer to use for playback."))),
                        React.createElement("p", { className: "mt-8" },
                            React.createElement(Trans, null,
                                "See the",
                                ' ',
                                React.createElement(ExternalLink, { href: "https://cs-demo-manager.com/docs/guides/2d-viewer#audio-playback" }, "documentation"),
                                ' ',
                                "for more information.")))),
                warnings.length > 0 && (React.createElement("div", { className: "mt-16 flex flex-col" },
                    React.createElement("div", { className: "mb-8 flex items-center gap-x-8" },
                        React.createElement(ExclamationTriangleIcon, { className: "size-16 text-orange-700" }),
                        React.createElement("p", null,
                            React.createElement(Trans, null, "The following issues were found:"))),
                    React.createElement("ul", { className: "flex max-h-[224px] max-w-[824px] flex-col gap-y-8 overflow-auto rounded bg-gray-100 p-8" }, warnings.map((warning, index) => {
                        return (React.createElement("li", { key: `${warning}${index}`, className: "selectable break-all select-text" }, warning));
                    })))),
                error !== undefined && React.createElement(ErrorMessage, { message: error })),
            React.createElement(DialogFooter, null,
                React.createElement(SpinnableButton, { isLoading: isExporting, variant: ButtonVariant.Primary, onClick: () => {
                        client.send({
                            name: RendererClientMessageName.ExportDemoPlayersVoice,
                            payload: {
                                demoPaths: [demoFilePath],
                                outputPath: window.csdm.getPathDirectoryName(demoFilePath),
                                mode: ExportVoiceMode.SingleFull,
                                steamIds: [],
                            },
                        });
                        setIsExporting(true);
                        setWarnings([]);
                        shouldAutoCloseDialog.current = true;
                    } },
                    React.createElement(Trans, null, "Generate audio file")),
                React.createElement(Button, { onClick: async () => {
                        const result = await window.csdm.showOpenDialog({
                            properties: ['openFile'],
                            defaultPath: window.csdm.getPathDirectoryName(demoFilePath),
                            filters: [{ name: t `Audio Files`, extensions: supportedAudioExtensions }],
                        });
                        if (result.canceled || !result.filePaths.length) {
                            return;
                        }
                        const [audioFilePath] = result.filePaths;
                        try {
                            await loadAudioFile(audioFilePath);
                            hideDialog();
                        }
                        catch (error) {
                            setError(React.createElement(Trans, null, "An error occurred."));
                        }
                    }, isDisabled: isExporting },
                    React.createElement(Trans, null, "Choose audio file\u2026")),
                React.createElement(CloseButton, { onClick: hideDialog, isDisabled: isExporting })))));
}
export function AudioSelectorButton({ loadAudioFile }) {
    const { showDialog } = useDialog();
    const { pause } = useViewerContext();
    return (React.createElement(PlaybackBarButton, { onClick: () => {
            pause();
            showDialog(React.createElement(AudioSelectorDialog, { loadAudioFile: loadAudioFile }));
        } },
        React.createElement(SoundCross, { className: "w-20" })));
}
//# sourceMappingURL=audio-selector-button.js.map