import { useLingui } from '@lingui/react/macro';
export function useBooleanHuman() {
    const { t } = useLingui();
    return (bool) => {
        return bool ? t({ id: 'yes', message: 'Yes' }) : t({ id: 'no', message: 'No' });
    };
}
//# sourceMappingURL=use-boolean-to-human.js.map