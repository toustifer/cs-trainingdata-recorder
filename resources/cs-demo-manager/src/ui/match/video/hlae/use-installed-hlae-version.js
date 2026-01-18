import { useHlaeState } from 'csdm/ui/match/video/hlae/use-hlae-state';
export function useInstalledHlaeVersion() {
    const hlaeState = useHlaeState();
    return hlaeState.version;
}
//# sourceMappingURL=use-installed-hlae-version.js.map