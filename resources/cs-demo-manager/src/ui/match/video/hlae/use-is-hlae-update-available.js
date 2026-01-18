import { useHlaeState } from 'csdm/ui/match/video/hlae/use-hlae-state';
export function useIsHlaeUpdateAvailable() {
    const hlaeState = useHlaeState();
    return hlaeState.isUpdateAvailable;
}
//# sourceMappingURL=use-is-hlae-update-available.js.map