import { MissingPlayerSlotError } from './errors/missing-player-slot-error';
export function assertPlayersSlotsAreDefined(actions) {
    for (const action of actions) {
        // If one of the slots are 0 it means that the demo has been analyzed between v3.3.0 and v3.6.0 of the app.
        // Valid players slots are available since v3.6.0.
        if (action.playerSlot === 0 || action.opponentSlot === 0) {
            throw new MissingPlayerSlotError();
        }
    }
}
//# sourceMappingURL=assert-players-slots-are-defined.js.map