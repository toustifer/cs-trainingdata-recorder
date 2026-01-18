import { useSelector } from 'csdm/ui/store/use-selector';
export function useVideosState() {
    const state = useSelector((state) => state.videos);
    return state;
}
//# sourceMappingURL=use-videos-state.js.map