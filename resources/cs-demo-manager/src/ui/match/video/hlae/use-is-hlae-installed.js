import { useHlaeState } from 'csdm/ui/match/video/hlae/use-hlae-state';
export function useIsHlaeInstalled() {
    const hlaeState = useHlaeState();
    return hlaeState.version !== undefined;
}
//# sourceMappingURL=use-is-hlae-installed.js.map