export function getDateTimestampAtMidnight(date) {
    return Number.parseInt((new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime() / 1000).toFixed(0));
}
//# sourceMappingURL=get-date-timestamp-at-midnight.js.map