import { formatMillisecondsToTimer } from 'csdm/ui/shared/format-milliseconds-to-timer';
export function getTimeElapsedBetweenTicks(params) {
    const elapsedTickCount = params.endTick - params.startTick;
    const millisecondsElapsed = (elapsedTickCount / params.tickrate) * 1000;
    const timeElapsed = formatMillisecondsToTimer(millisecondsElapsed);
    return timeElapsed;
}
//# sourceMappingURL=get-time-elapsed-between-ticks.js.map