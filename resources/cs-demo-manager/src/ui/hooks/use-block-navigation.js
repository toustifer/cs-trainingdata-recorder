import { useBlocker } from 'react-router';
export function useBlockNavigation(isNavigationBlocked) {
    const blocker = useBlocker(isNavigationBlocked);
    return blocker;
}
//# sourceMappingURL=use-block-navigation.js.map