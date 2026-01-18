export const PlayerSequenceEvent = {
    Kills: 'kills',
    Deaths: 'deaths',
    Rounds: 'rounds',
};
export function isValidPlayerSequenceEvent(value) {
    return Object.values(PlayerSequenceEvent).includes(value);
}
//# sourceMappingURL=player-sequence-event.js.map