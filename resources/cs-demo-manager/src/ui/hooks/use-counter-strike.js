import { RendererClientMessageName } from 'csdm/server/renderer-client-message-name';
import { useWebSocketClient } from 'csdm/ui/hooks/use-web-socket-client';
import { useIsCsRunning } from './use-is-cs-running';
import { Game } from 'csdm/common/types/counter-strike';
export function isCounterStrikeStartable(game) {
    if (window.csdm.isMac) {
        return game === Game.CSGO;
    }
    return true;
}
export function isVideoGenerationAvailable(game) {
    if (game === Game.CSGO) {
        return true;
    }
    return !window.csdm.isMac;
}
export function useCounterStrike() {
    const client = useWebSocketClient();
    const isCsRunning = useIsCsRunning();
    const isKillCsRequired = async () => {
        const csRunning = await isCsRunning();
        if (csRunning) {
            const isCs2Connected = await client.send({
                name: RendererClientMessageName.IsCs2ConnectedToServer,
            });
            return !isCs2Connected;
        }
        return false;
    };
    const startGame = async (options) => {
        await client.send({
            name: RendererClientMessageName.StartCounterStrike,
            payload: options,
        });
    };
    const watchDemo = async (options) => {
        await client.send({
            name: RendererClientMessageName.WatchDemo,
            payload: options,
        });
    };
    const watchPlayerLowlights = async (options) => {
        await client.send({
            name: RendererClientMessageName.WatchPlayerLowlights,
            payload: options,
        });
    };
    const watchPlayerHighlights = async (options) => {
        await client.send({
            name: RendererClientMessageName.WatchPlayerHighlights,
            payload: options,
        });
    };
    const watchPlayerAsSuspect = async (options) => {
        await client.send({
            name: RendererClientMessageName.WatchPlayerAsSuspect,
            payload: options,
        });
    };
    const watchPlayerRounds = async (options) => {
        await client.send({
            name: RendererClientMessageName.WatchPlayerRounds,
            payload: options,
        });
    };
    return {
        startGame,
        watchDemo,
        watchPlayerRounds,
        watchPlayerLowlights,
        watchPlayerHighlights,
        watchPlayerAsSuspect,
        isKillCsRequired,
        isCsRunning,
    };
}
//# sourceMappingURL=use-counter-strike.js.map