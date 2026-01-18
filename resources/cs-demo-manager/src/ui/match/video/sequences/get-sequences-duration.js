import { roundNumber } from 'csdm/common/math/round-number';
export function getSequencesDuration(sequences, tickrate) {
    let duration = 0;
    for (const sequence of sequences) {
        duration += (sequence.endTick - sequence.startTick) / tickrate;
    }
    return roundNumber(duration);
}
//# sourceMappingURL=get-sequences-duration.js.map