export function getDateDaysAgo(days) {
    const date = new Date();
    date.setDate(date.getDate() - days);
    return date;
}
//# sourceMappingURL=get-date-days-ago.js.map