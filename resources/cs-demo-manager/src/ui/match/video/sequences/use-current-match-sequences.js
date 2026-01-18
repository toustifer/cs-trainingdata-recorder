import { useSequencesByDemoFilePath } from './use-sequences-by-demo-file-path';
import { useCurrentMatch } from 'csdm/ui/match/use-current-match';
export function useCurrentMatchSequences() {
    const currentMatch = useCurrentMatch();
    const sequencesByDemoFilePath = useSequencesByDemoFilePath();
    return sequencesByDemoFilePath[currentMatch.demoFilePath] || [];
}
//# sourceMappingURL=use-current-match-sequences.js.map