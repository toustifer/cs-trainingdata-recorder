export function isCtrlOrCmdEvent(event) {
    return (window.csdm.isMac && event.metaKey) || (!window.csdm.isMac && event.ctrlKey);
}
export function isSelectAllKeyboardEvent(event) {
    if (event.key.toLocaleLowerCase() !== 'a') {
        return false;
    }
    return isCtrlOrCmdEvent(event);
}
//# sourceMappingURL=keyboard.js.map