import { useLocale } from 'csdm/ui/settings/ui/use-locale';
export function useSecondsToFormattedMinutes() {
    const locale = useLocale();
    return (seconds, formatting = 'long') => {
        return new Intl.NumberFormat(locale, {
            maximumFractionDigits: 0,
            style: 'unit',
            unit: 'minute',
            unitDisplay: formatting,
        }).format(seconds / 60);
    };
}
//# sourceMappingURL=use-seconds-to-formatted-minutes.js.map