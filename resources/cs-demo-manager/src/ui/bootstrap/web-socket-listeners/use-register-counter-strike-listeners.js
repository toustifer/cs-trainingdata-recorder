import React, { useEffect } from 'react';
import { Trans, useLingui } from '@lingui/react/macro';
import { useShowToast } from 'csdm/ui/components/toasts/use-show-toast';
import { RendererServerMessageName } from 'csdm/server/renderer-server-message-name';
import { ErrorCode } from 'csdm/common/error-code';
import { Game } from 'csdm/common/types/counter-strike';
import { ExternalLink } from 'csdm/ui/components/external-link';
import { HlaeError } from 'csdm/ui/components/messages/hlae-error';
function getErrorMessageFromError(error) {
    const { errorCode } = error;
    switch (errorCode) {
        case ErrorCode.DemoNotFound:
            return React.createElement(Trans, null, "Demo not found");
        case ErrorCode.MatchNotFound:
            return React.createElement(Trans, null, "Match not found");
        case ErrorCode.CounterStrikeExecutableNotFound:
            return (React.createElement("div", null,
                React.createElement("p", null,
                    React.createElement(Trans, null, "Counter-Strike executable not found.")),
                window.csdm.isLinux && (React.createElement("p", null,
                    React.createElement(Trans, null, "Make sure Steam is not installed through Flatpak as it's not supported!"))),
                error.game === Game.CSGO && (React.createElement("p", null,
                    React.createElement(Trans, null, "Please make sure that CS:GO is installed by selecting the \"csgo_legacy\" branch from the CS2 \"Betas\" property tab on Steam."))),
                React.createElement("p", null,
                    React.createElement(Trans, null,
                        "Read the",
                        ' ',
                        React.createElement(ExternalLink, { href: "https://cs-demo-manager.com/docs/guides/playback" }, "documentation"),
                        " for more information."))));
        case ErrorCode.CustomCounterStrikeExecutableNotFound:
            return (React.createElement("p", null,
                React.createElement(Trans, null, "Counter-Strike executable not found, check your app playback settings.")));
        case ErrorCode.UnsupportedGame: {
            const game = error.game;
            return React.createElement(Trans, null,
                game,
                " is not supported on your operating system");
        }
        case ErrorCode.HlaeNotInstalled: {
            return React.createElement(Trans, null, "HLAE executable not found");
        }
        case ErrorCode.NoKillsFound:
            return React.createElement(Trans, null, "No kills found");
        case ErrorCode.MissingPlayerSlot:
            return (React.createElement("p", null,
                React.createElement(Trans, null, "This demo needs to be re-analyzed to make the camera focus work.")));
        case ErrorCode.NoRoundsFound:
            return React.createElement(Trans, null, "No rounds found");
        case ErrorCode.NoDeathsFound:
            return React.createElement(Trans, null, "No deaths found");
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
        case ErrorCode.SteamNotRunning:
            return React.createElement(Trans, null, "Steam is not running");
        case ErrorCode.GameError:
            return (React.createElement("p", null,
                React.createElement(Trans, null,
                    "The game crashed, please see",
                    ' ',
                    React.createElement(ExternalLink, { href: "https://cs-demo-manager.com/docs/guides/playback#cs2-demo-playback-doesnt-start-or-crashes" }, "this documentation"),
                    ' ',
                    "for help.")));
        case ErrorCode.HlaeError:
            return React.createElement(HlaeError, null);
        case ErrorCode.AccessDenied:
            return (React.createElement("div", null,
                React.createElement("p", null,
                    React.createElement(Trans, null, "The game process exited with an access denied error.")),
                React.createElement("p", null,
                    React.createElement(Trans, null, "Make sure to close any anti-cheat software and retry."))));
        case ErrorCode.CounterStrikeAlreadyRunning: {
            const game = error.game;
            return React.createElement(Trans, null,
                game,
                " is already running");
        }
        default:
            return React.createElement(Trans, null, "An error occurred");
    }
}
export function useRegisterCounterStrikeListeners(client) {
    const showToast = useShowToast();
    const { t } = useLingui();
    useEffect(() => {
        const onGameStart = () => {
            showToast({
                id: 'game-starting',
                content: t `Counter-Strike starting…`,
            });
        };
        const onError = (error) => {
            const message = getErrorMessageFromError(error);
            showToast({
                content: message,
                id: 'game-starting',
                type: 'error',
            });
        };
        client.on(RendererServerMessageName.StartingCounterStrike, onGameStart);
        client.on(RendererServerMessageName.CounterStrikeError, onError);
        return () => {
            client.off(RendererServerMessageName.StartingCounterStrike, onGameStart);
            client.off(RendererServerMessageName.CounterStrikeError, onError);
        };
    });
}
//# sourceMappingURL=use-register-counter-strike-listeners.js.map