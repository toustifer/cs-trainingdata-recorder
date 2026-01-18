import { useDownloadsState } from 'csdm/ui/downloads/use-downloads-state';
export function useFaceitState() {
    const state = useDownloadsState();
    return state.faceit;
}
//# sourceMappingURL=use-faceit-state.js.map