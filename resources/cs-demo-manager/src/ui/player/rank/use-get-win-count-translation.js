import { useLingui } from '@lingui/react/macro';
export function useGetWinCountTranslation() {
    const { t } = useLingui();
    return (winCount) => {
        return t `Win count: ${winCount}`;
    };
}
//# sourceMappingURL=use-get-win-count-translation.js.map