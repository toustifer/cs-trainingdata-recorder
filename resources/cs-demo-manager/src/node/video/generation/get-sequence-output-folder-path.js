import path from 'node:path';
import { getSequenceName } from './get-sequence-name';
export function getSequenceOutputFolderPath(sequence, outputFolderPath) {
    const sequenceName = getSequenceName(sequence);
    return path.join(outputFolderPath, sequenceName);
}
//# sourceMappingURL=get-sequence-output-folder-path.js.map