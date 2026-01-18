import { useCurrentMatch } from './use-current-match';
export function useCurrentMatchChecksum() {
    const match = useCurrentMatch();
    return match.checksum;
}
//# sourceMappingURL=use-current-match-checksum.js.map