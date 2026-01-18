import { useComputeRequiredBytes } from './use-compute-require-bytes';
export function useGetSequencesRequiredDiskSpace() {
    const computeRequiredBytes = useComputeRequiredBytes();
    return (sequences, tickrate) => {
        let bytes = 0;
        for (const sequence of sequences) {
            bytes += computeRequiredBytes(sequence.startTick, sequence.endTick, tickrate);
        }
        return bytes;
    };
}
//# sourceMappingURL=use-get-sequences-required-disk-space.js.map