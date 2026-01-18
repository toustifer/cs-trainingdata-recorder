import { usePlayerState } from './use-player-state';
export function useUnsafePlayer() {
    const { player } = usePlayerState();
    return player;
}
//# sourceMappingURL=use-unsafe-player.js.map