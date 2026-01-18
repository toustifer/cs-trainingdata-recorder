import React from 'react';
import { Trans } from '@lingui/react/macro';
import { ErrorCode } from 'csdm/common/error-code';
import { ExternalLink } from 'csdm/ui/components/external-link';
import { Game } from 'csdm/common/types/counter-strike';
import { HlaeError } from 'csdm/ui/components/messages/hlae-error';
export function getPlaybackErrorMessageFromErrorCode(game, errorCode) {
    switch (errorCode) {
        case ErrorCode.DemoNotFound:
            return (React.createElement("p", null,
                React.createElement(Trans, null, "Demo not found.")));
        case ErrorCode.InvalidDemoPath:
            return (React.createElement("div", null,
                React.createElement("p", null,
                    React.createElement(Trans, null, "The demo's path contains characters that are not supported by Counter-Strike and would prevent playback.")),
                React.createElement("p", null,
                    React.createElement(Trans, null,
                        "You have to move the demo in a folder that contains only Basic Latin characters - see",
                        ' ',
                        React.createElement(ExternalLink, { href: "https://cs-demo-manager.com/docs/guides/playback#cs2-demo-playback-doesnt-start-or-crashes" }, "this documentation"),
                        ' ',
                        "for details."))));
        case ErrorCode.StartCounterStrikeError:
            return (React.createElement("div", { className: "flex flex-col gap-y-4" },
                React.createElement("p", null,
                    React.createElement(Trans, null, "Failed to start the game, make sure Steam is running and you are connected.")),
                game === Game.CSGO && (React.createElement("p", null,
                    React.createElement(Trans, null,
                        "Please make sure that CS:GO is installed by selecting the ",
                        React.createElement("strong", null, "csgo_legacy"),
                        " branch from the CS2 \"Betas\" property tab on Steam.")))));
        case ErrorCode.CounterStrikeExecutableNotFound:
            return (React.createElement("p", null,
                React.createElement(Trans, null, "Counter-Strike executable not found.")));
        case ErrorCode.CustomCounterStrikeExecutableNotFound:
            return (React.createElement("p", null,
                React.createElement(Trans, null, "Counter-Strike executable not found, check your app playback settings.")));
        case ErrorCode.HlaeNotInstalled:
            return (React.createElement("p", null,
                React.createElement(Trans, null, "HLAE is not installed.")));
        case ErrorCode.VirtualDubNotInstalled:
            return (React.createElement("p", null,
                React.createElement(Trans, null, "VirtualDub is not installed.")));
        case ErrorCode.FfmpegNotInstalled:
            return (React.createElement("p", null,
                React.createElement(Trans, null, "FFmpeg is not installed.")));
        case ErrorCode.NoSequencesFound:
            return (React.createElement("p", null,
                React.createElement(Trans, null, "No sequences provided.")));
        case ErrorCode.SteamNotRunning:
            return (React.createElement("p", null,
                React.createElement(Trans, null, "Steam is not running.")));
        case ErrorCode.FfmpegError:
            return (React.createElement("p", null,
                React.createElement(Trans, null, "FFmpeg returned an error.")));
        case ErrorCode.VirtualDubError:
            return (React.createElement("p", null,
                React.createElement(Trans, null, "VirtualDub returned an error.")));
        case ErrorCode.WavFileNotFound:
            return (React.createElement("p", null,
                React.createElement(Trans, null, "WAV file not found.")));
        case ErrorCode.RawFilesNotFound:
            return (React.createElement("p", null,
                React.createElement(Trans, null, "Raw files not found.")));
        case ErrorCode.GameError:
            return (React.createElement("p", null,
                React.createElement(Trans, null, "Counter-Strike crashed.")));
        case ErrorCode.HlaeError:
            return React.createElement(HlaeError, null);
        case ErrorCode.CounterStrikeNotConnected:
            return React.createElement(Trans, null, "Unable to communicate with Counter-Strike, make sure to start it from the application.");
        case ErrorCode.CounterStrikeNotRunning:
            return React.createElement(Trans, null, "Counter-Strike is not running, please start it from the application.");
        case ErrorCode.CounterStrikeNoResponse:
            return React.createElement(Trans, null, "Counter-Strike did not respond, please try again.");
        default:
            return (React.createElement("p", null,
                React.createElement(Trans, null, "An error occurred.")));
    }
}
//# sourceMappingURL=get-playback-error-from-error-code.js.map