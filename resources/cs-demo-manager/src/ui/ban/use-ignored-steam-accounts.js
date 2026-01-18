import { useBanState } from './use-ban-state';
export function useIgnoredSteamAccounts() {
    const state = useBanState();
    return state.ignoredAccounts;
}
//# sourceMappingURL=use-ignored-steam-accounts.js.map