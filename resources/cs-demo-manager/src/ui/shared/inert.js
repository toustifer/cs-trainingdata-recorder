export function makeElementInert(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.inert = true;
    }
}
export function makeElementNonInert(elementId) {
    const element = document.getElementById(elementId);
    if (element) {
        element.inert = false;
    }
}
//# sourceMappingURL=inert.js.map