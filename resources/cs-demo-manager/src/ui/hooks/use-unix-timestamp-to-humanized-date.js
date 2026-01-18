import { useLocale } from 'csdm/ui/settings/ui/use-locale';
import { unixTimestampToDate } from 'csdm/common/date/unix-timestamp-to-date';
const DEFAULT_FORMAT_OPTIONS = {
    year: '2-digit',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
};
export function useUnixTimestampToHumanizedDate() {
    const locale = useLocale();
    return (unixTimestamp, options = DEFAULT_FORMAT_OPTIONS) => {
        return new Intl.DateTimeFormat(locale, options).format(unixTimestampToDate(unixTimestamp));
    };
}
//# sourceMappingURL=use-unix-timestamp-to-humanized-date.js.map