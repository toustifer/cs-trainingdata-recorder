import path from 'node:path';
export function getSequenceOutputFilePath(outputFolderPath, sequence, videoContainer) {
    return path.join(outputFolderPath, `sequence-${sequence.number}-tick-${sequence.startTick}-to-${sequence.endTick}.${videoContainer}`);
}
//# sourceMappingURL=get-sequence-output-file-path.js.map