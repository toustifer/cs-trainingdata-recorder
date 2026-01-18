export function subtractDateDays(date, days) {
    const newDate = new Date();
    newDate.setDate(date.getDate() - days);
    return newDate;
}
//# sourceMappingURL=subtract-date-days.js.map