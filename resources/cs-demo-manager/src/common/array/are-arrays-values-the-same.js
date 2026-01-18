export function areArraysValuesTheSame(a, b) {
    if (a.length !== b.length) {
        return false;
    }
    const difference = a.filter((value) => {
        return !b.includes(value);
    });
    return difference.length === 0;
}
//# sourceMappingURL=are-arrays-values-the-same.js.map