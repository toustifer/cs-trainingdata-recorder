import { roundNumber } from './round-number';
export function roundNumberPercentage(number, places) {
    if (Number.isNaN(number)) {
        return 0;
    }
    return roundNumber(number * 100, places);
}
//# sourceMappingURL=round-number-percentage.js.map