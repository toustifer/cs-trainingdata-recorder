import { useSelector } from 'csdm/ui/store/use-selector';
export function useTags() {
    const tags = useSelector((state) => state.tags);
    return tags;
}
//# sourceMappingURL=use-tags.js.map