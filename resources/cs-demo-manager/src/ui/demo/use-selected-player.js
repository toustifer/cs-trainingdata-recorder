import { useDemoState } from './use-demo-state';
export function useSelectedPlayer() {
    const demoState = useDemoState();
    if (demoState.selectedPlayer === undefined) {
        throw new Error('No player selected');
    }
    return demoState.selectedPlayer;
}
//# sourceMappingURL=use-selected-player.js.map