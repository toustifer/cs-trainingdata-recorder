import { useDownloadsState } from 'csdm/ui/downloads/use-downloads-state';
export function usePendingDownloadsState() {
    const downloadsState = useDownloadsState();
    return downloadsState.pending;
}
//# sourceMappingURL=use-pending-downloads-state.js.map