export function sortSequencesByStartTick(sequences) {
    const sortedSequencesByStartTick = sequences.toSorted((currentSequence, nextSequence) => {
        if (currentSequence.startTick < nextSequence.startTick) {
            return -1;
        }
        if (currentSequence.startTick > nextSequence.startTick) {
            return 1;
        }
        return 0;
    });
    return sortedSequencesByStartTick;
}
//# sourceMappingURL=sort-sequences-by-start-tick.js.map