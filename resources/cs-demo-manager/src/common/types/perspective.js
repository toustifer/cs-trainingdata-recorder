export const Perspective = {
    Player: 'player',
    Enemy: 'enemy',
};
export function isValidPerspective(value) {
    return Object.values(Perspective).includes(value);
}
//# sourceMappingURL=perspective.js.map